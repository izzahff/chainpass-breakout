import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Signer } from '@solana/web3.js';

// Export this so it can be used in the confirmation dialog
// Using a derived address that is guaranteed to exist on Solana
export const DEFAULT_CONTRACT_ADDRESS = 'J7d74aBLemFYd5GrRrpS8gSgFV6j9MjqH2xfCsVNpaoN';

export class TicketContract {
  public connection: Connection;
  public contractAddress: PublicKey;

  constructor(connection: Connection) {
    this.connection = connection;
    // Using a production-ready address
    try {
      this.contractAddress = new PublicKey(DEFAULT_CONTRACT_ADDRESS);
      console.log("Contract address initialized:", this.contractAddress.toString());
    } catch (error) {
      console.error("Error initializing contract address:", error);
      // Fallback to system program as last resort
      this.contractAddress = SystemProgram.programId;
      console.log("Using fallback system program address:", this.contractAddress.toString());
    }
  }

  async purchaseTicket(
    buyerPublicKey: PublicKey,
    price: number,
    transaction: Transaction
  ): Promise<string> {
    try {
      console.log("TicketContract: Sending transaction to network");
      console.log("Transaction details:", {
        fromPubkey: buyerPublicKey.toString(),
        toPubkey: this.contractAddress.toString(),
        price: price,
        instructions: transaction.instructions.length,
        recentBlockhash: transaction.recentBlockhash
      });
      
      // Ensure the transaction data is fully serialized before sending
      const rawTransaction = transaction.serialize({
        verifySignatures: false  // Set to false to allow sending regardless of missing signatures
      });
      
      console.log("Transaction serialized, sending to network");
      
      // For Phantom, use sendRawTransaction with the serialized transaction
      const signature = await this.connection.sendRawTransaction(
        rawTransaction,
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );
      
      console.log(`TicketContract: Transaction sent with signature: ${signature}`);
      
      // Use simpler confirmation method to avoid potential blockhash issues
      console.log("TicketContract: Confirming transaction");
      
      // First check if the transaction was actually sent to the network
      try {
        const signatureStatus = await this.connection.getSignatureStatus(signature);
        console.log("Initial signature status:", signatureStatus);
        
        if (signatureStatus.value === null) {
          console.log("Transaction not yet processed, waiting for confirmation...");
        } else if (signatureStatus.value && signatureStatus.value.err) {
          console.error("Transaction has errors:", signatureStatus.value.err);
          throw new Error(`Transaction error: ${JSON.stringify(signatureStatus.value.err)}`);
        }
      } catch (statusError) {
        console.error("Error checking signature status:", statusError);
      }
      
      // Use the simplest confirmation method to avoid complex error handling
      const confirmation = await this.connection.confirmTransaction(signature, 'processed');
      console.log("Confirmation result:", confirmation);
      
      // Check for confirmation errors
      if (confirmation.value && confirmation.value.err) {
        console.error('Transaction confirmed but has errors:', confirmation.value.err);
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      console.log("TicketContract: Transaction confirmed successfully", confirmation);
      return signature;
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error(`Error type: ${error.name}, Message: ${error.message}`);
        if (error.stack) {
          console.error(`Stack trace: ${error.stack}`);
        }
      }
      
      throw error;
    }
  }

  async refundTicket(
    buyerPublicKey: PublicKey,
    price: number,
    signedTransaction?: Transaction
  ): Promise<string> {
    try {
      console.log("TicketContract: Processing refund of", price, "SOL to", buyerPublicKey.toString());
      
      // Use a more precise lamports calculation
      const lamports = Math.round(price * LAMPORTS_PER_SOL);
      console.log("Refund amount in lamports:", lamports);
      
      let signature: string;
      
      // If a signed transaction is provided, use it
      if (signedTransaction) {
        console.log("Using pre-signed transaction for refund");
        
        // For Phantom, use sendRawTransaction with the serialized transaction
        signature = await this.connection.sendRawTransaction(
          signedTransaction.serialize(),
          { skipPreflight: false, preflightCommitment: 'confirmed' }
        );
      } else {
        // This path likely won't work in production since we need wallet authorization
        console.warn("WARNING: Using direct transaction without user signature - this likely won't work with real accounts");
        
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: this.contractAddress,
            toPubkey: buyerPublicKey,
            lamports: lamports,
          })
        );
        
        signature = await this.connection.sendTransaction(transaction, []);
      }
      
      console.log("Refund transaction sent with signature:", signature);
      
      // Confirm transaction
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      console.log("Refund transaction confirmed:", confirmation);
      
      if (confirmation.value && confirmation.value.err) {
        console.error("Refund transaction has errors:", confirmation.value.err);
        throw new Error(`Refund failed: ${JSON.stringify(confirmation.value.err)}`);
      }
      
      return signature;
    } catch (error) {
      console.error('Error refunding ticket:', error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error(`Error type: ${error.name}, Message: ${error.message}`);
        if (error.stack) {
          console.error(`Stack trace: ${error.stack}`);
        }
      }
      
      throw error;
    }
  }
}