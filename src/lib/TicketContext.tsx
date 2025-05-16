import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Event } from '../types';
import { TicketContract, DEFAULT_CONTRACT_ADDRESS } from '../contracts/TicketContract';

type TicketContextType = {
  userTickets: Event[];
  isLoading: boolean;
  showPurchaseSuccess: boolean;
  showPurchaseError: boolean;
  errorMessage: string;
  purchaseTicket: (event: Event, quantity: number) => Promise<boolean>;
  refundTicket: (ticketId: string) => Promise<void>;
  clearPurchaseError: () => void;
  forceRefreshTickets: () => void;
  clearAllTickets: () => void;
  checkTransactionStatus?: (signature: string) => Promise<any>;
  contractAddress: string;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Add a constant for localStorage key
const USER_TICKETS_STORAGE_KEY = 'chainpass_user_tickets';

export function TicketProvider({ children }: { children: ReactNode }) {
  const [userTickets, setUserTickets] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showPurchaseError, setShowPurchaseError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Add refresh counter to force re-renders
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const ticketContract = new TicketContract(connection);

  // Function to force refresh of tickets from localStorage
  const forceRefreshTickets = () => {
    console.log("Forcing refresh of tickets...");
    setRefreshCounter(prev => prev + 1); // Trigger useEffect by changing the counter
  };

  // Load tickets from localStorage on initial render and when refreshCounter changes
  useEffect(() => {
    console.log("Loading tickets from localStorage, refresh count:", refreshCounter);
    const savedTickets = localStorage.getItem(USER_TICKETS_STORAGE_KEY);
    if (savedTickets) {
      try {
        const parsedTickets = JSON.parse(savedTickets);
        if (Array.isArray(parsedTickets)) {
          console.log('Loaded tickets from storage:', parsedTickets);
          setUserTickets(parsedTickets);
        }
      } catch (error) {
        console.error('Error parsing saved tickets:', error);
      }
    }
  }, [refreshCounter]);

  // Save tickets to localStorage when they change
  useEffect(() => {
    if (userTickets.length > 0) {
      console.log('Saving tickets to storage:', userTickets);
      localStorage.setItem(USER_TICKETS_STORAGE_KEY, JSON.stringify(userTickets));
    }
  }, [userTickets]);

  const clearPurchaseError = () => {
    setShowPurchaseError(false);
    setErrorMessage('');
  };

  const purchaseTicket = async (event: Event, quantity: number): Promise<boolean> => {
    if (!publicKey || !signTransaction) {
      setErrorMessage('Please connect your wallet first');
      setShowPurchaseError(true);
      console.error("Wallet not connected for purchase");
      return false;
    }

    setIsLoading(true);
    try {
      console.log(`Starting purchase of ${quantity} tickets for event: ${event.title}`);
      console.log("Using contract address:", DEFAULT_CONTRACT_ADDRESS);
      
      const totalPrice = event.price * quantity;
      console.log(`Total price: ${totalPrice} SOL`);
      
      // Use a more precise lamports calculation to avoid rounding errors
      const lamports = Math.round(totalPrice * LAMPORTS_PER_SOL);
      console.log(`Price in lamports: ${lamports}`);
      
      // Create and prepare the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: ticketContract.contractAddress,
          lamports: lamports,
        })
      );

      // Get the latest blockhash with 'confirmed' commitment level instead of 'finalized'
      // This can help with transaction processing speed
      console.log("Getting latest blockhash");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Set transaction options for better compatibility with Phantom
      // Not setting extra signatures helps avoid signature verification errors
      transaction.setSigners(publicKey);
      
      console.log("Transaction prepared with blockhash:", blockhash);
      console.log("Transaction signers:", transaction.signatures.map(s => s.publicKey.toString()));
      console.log("Last valid block height:", lastValidBlockHeight);
      
      try {
        // Sign the transaction - this will trigger the Phantom wallet
        console.log("Requesting wallet signature - Phantom popup should appear");
        const signedTransaction = await signTransaction(transaction);
        console.log("Transaction signed by wallet");
        
        // Send the signed transaction to the blockchain
        console.log("Sending signed transaction to blockchain");
        const signature = await ticketContract.purchaseTicket(publicKey, totalPrice, signedTransaction);
        console.log("Transaction signature received:", signature);
  
        // Add the signature verification by polling transaction status multiple times
        console.log("Checking transaction status explicitly");
        let statusCheck;
        let retries = 0;
        const maxRetries = 3;
        
        // Poll the transaction status a few times to ensure it's processed
        while (retries < maxRetries) {
          statusCheck = await connection.getSignatureStatus(signature);
          console.log(`Transaction status (attempt ${retries + 1}/${maxRetries}):`, statusCheck);
          
          if (statusCheck.value === null) {
            // Transaction not yet processed
            console.log("Transaction not yet processed, waiting...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
          } else if (statusCheck.value && statusCheck.value.err) {
            // Transaction processed but has errors
            throw new Error(`Transaction failed: ${JSON.stringify(statusCheck.value.err)}`);
          } else {
            // Transaction processed successfully
            console.log("Transaction processed successfully:", statusCheck.value?.confirmationStatus);
            break;
          }
        }
        
        // Final check
        if (retries === maxRetries) {
          console.warn("Transaction status check timed out, but continuing anyway");
        }
        
        // Wait a moment before proceeding (shorter wait as we've already been polling)
        console.log("Waiting for blockchain to finalize state");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add tickets (can add multiple based on quantity)
        const newTickets = Array(quantity).fill(null).map(() => {
          // Important: Create a deep copy of the event to avoid reference issues
          return JSON.parse(JSON.stringify(event));
        });
        
        // Create unique tickets by adding a unique ID for each instance
        const uniqueTickets = newTickets.map((ticket, index) => ({
          ...ticket,
          id: `${ticket.id}-${Date.now()}-${index}`, // Make each ticket ID unique
          purchaseDate: new Date().toISOString(),
          transactionSignature: signature
        }));
        
        console.log('Adding tickets to user collection:', uniqueTickets);
        
        // Add new tickets to state - important to create a new array to trigger state update
        const allTickets = [...userTickets, ...uniqueTickets];
        setUserTickets(allTickets);
        
        // Immediately save to localStorage to ensure persistence
        localStorage.setItem(USER_TICKETS_STORAGE_KEY, JSON.stringify(allTickets));
        console.log('Updated ticket collection in localStorage:', allTickets);
        
        setShowPurchaseSuccess(true);
        setTimeout(() => {
          setShowPurchaseSuccess(false);
        }, 3000);
  
        // Force a refresh to ensure UI is updated
        forceRefreshTickets();
  
        return true;
      } catch (signError) {
        console.error("Error during transaction signing or sending:", signError);
        if (signError instanceof Error && signError.message.includes('User rejected')) {
          console.error("User rejected the transaction in Phantom wallet");
          setErrorMessage('Transaction was rejected. Please try again.');
        } else {
          setErrorMessage('Transaction failed: ' + (signError instanceof Error ? signError.message : 'Unknown error'));
        }
        setShowPurchaseError(true);
        return false;
      }
    } catch (error) {
      console.error('Failed to purchase ticket. Error details:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        console.error(`Transaction error: ${error.message}`);
        setErrorMessage('Failed to purchase ticket: ' + error.message);
      } else {
        console.error("Unknown error type:", error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      
      setShowPurchaseError(true);
      return false;
    } finally {
      setIsLoading(false);
      console.log("Purchase process completed (success or failure)");
    }
  };

  const refundTicket = async (ticketId: string) => {
    if (!publicKey || !signTransaction) {
      setErrorMessage('Please connect your wallet first');
      setShowPurchaseError(true);
      return;
    }

    setIsLoading(true);
    try {
      // Find the ticket in user's collection
      const ticket = userTickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      
      console.log("Processing refund for ticket:", ticket);
      
      // Create and prepare the refund transaction
      // Note: In a real app, this would need to verify the ticket ownership on-chain
      const totalPrice = ticket.price;
      
      // Use a more precise lamports calculation
      const lamports = Math.round(totalPrice * LAMPORTS_PER_SOL);
      console.log(`Refund amount: ${totalPrice} SOL (${lamports} lamports)`);
      
      // Important: For refunds, we're sending FROM the contract TO the user
      // But in practice, for demo purposes we'll reverse it to simulate a refund
      // In a real app, this would use a proper escrow or program-derived address with authority
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey, // In reality this would be the contract
          toPubkey: publicKey,   // Send to the same address to simulate a refund
          lamports: 100,         // Token amount (just a minimal test amount for now)
        })
      );

      // Get the latest blockhash
      console.log("Getting latest blockhash for refund");
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Alert the user about the process
      alert("Please confirm the refund transaction in your wallet when it appears.");
      
      try {
        // Sign the transaction
        console.log("Requesting wallet signature for refund");
        const signedTransaction = await signTransaction(transaction);
        console.log("Refund transaction signed by wallet");
        
        // Send the signed transaction
        const signature = await ticketContract.refundTicket(
          publicKey, 
          totalPrice, 
          signedTransaction
        );
        
        console.log("Refund transaction completed with signature:", signature);
        
        // Show success message
        alert(`Refund processed successfully! Transaction signature: ${signature}`);
        
        // Remove the refunded ticket from state
        const updatedTickets = userTickets.filter(t => t.id !== ticketId);
        setUserTickets(updatedTickets);
        
        // Save to localStorage
        localStorage.setItem(USER_TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
        console.log('Removed ticket from collection, updated state:', updatedTickets);
        
        // Force refresh to ensure UI update
        forceRefreshTickets();
      } catch (signError) {
        console.error("Error during refund transaction:", signError);
        
        if (signError instanceof Error && signError.message.includes('User rejected')) {
          throw new Error('Refund cancelled: Transaction was rejected in your wallet');
        } else {
          throw signError;
        }
      }
    } catch (error) {
      console.error('Failed to refund ticket:', error);
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to refund ticket. Please try again.');
      }
      
      setShowPurchaseError(true);
      alert(`Refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllTickets = () => {
    console.log("Clearing all tickets from storage");
    localStorage.removeItem(USER_TICKETS_STORAGE_KEY);
    setUserTickets([]);
    setRefreshCounter(prev => prev + 1);
  };

  // Debug utility function to check transaction status
  const checkTransactionStatus = async (signature: string) => {
    if (!connection) return null;
    
    try {
      console.log("Checking transaction status for:", signature);
      const status = await connection.getSignatureStatus(signature);
      console.log("Transaction status:", status);
      
      if (status.value === null) {
        console.log("Transaction not found or not confirmed yet");
      } else if (status.value.err) {
        console.error("Transaction has errors:", status.value.err);
      } else {
        console.log("Transaction successfully confirmed with status:", status.value.confirmationStatus);
      }
      
      return status;
    } catch (error) {
      console.error("Error checking transaction status:", error);
      return null;
    }
  };

  return (
    <TicketContext.Provider 
      value={{ 
        userTickets, 
        isLoading, 
        showPurchaseSuccess,
        showPurchaseError,
        errorMessage,
        purchaseTicket, 
        refundTicket,
        clearPurchaseError,
        forceRefreshTickets,
        clearAllTickets,
        checkTransactionStatus,
        contractAddress: DEFAULT_CONTRACT_ADDRESS
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}