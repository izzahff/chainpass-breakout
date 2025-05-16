export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  address: string;
  price: number;
  image: string;
  category: string;
  availableSeats: number;
  earlyAccess: boolean;
  lineup?: Artist[];
}

export interface Artist {
  name: string;
  time: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  staked: boolean;
  stakeAmount: number;
}

export interface User {
  id: string;
  name: string;
  walletAddress: string;
  joinedDate: string;
  totalStaked: number;
  activeStakes: number;
  tickets: string[];
}

export interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'purchase';
  amount: number;
  eventId: string;
  userId: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}