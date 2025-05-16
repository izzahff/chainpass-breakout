use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub organizer: Pubkey,       // Event organizer pubkey
    pub name: String,            // Event name (used for PDA derivation)
    pub ticket_price: u64,       // Price per ticket in lamports
    pub max_tickets: u32,        // Maximum number of tickets available
    pub tickets_sold: u32,       // Number of tickets sold
    pub event_date: i64,         // Unix timestamp for when the event occurs
    pub is_active: bool,         // Whether tickets can be purchased
    pub is_finalized: bool,      // Whether event has been finalized and funds withdrawn
    pub vault: Pubkey,           // SOL vault holding funds until event is finalized
    pub bump: u8,                // Bump seed for PDA derivation
}

#[account]
pub struct Ticket {
    pub event: Pubkey,           // The event this ticket is for
    pub owner: Pubkey,           // The ticket owner's pubkey
    pub ticket_number: u32,      // Ticket number within the event
    pub is_used: bool,           // Whether the ticket has been used/refunded
    pub purchase_date: i64,      // When the ticket was purchased
    pub mint: Pubkey,            // NFT mint address representing this ticket
    pub bump: u8,                // Bump seed for PDA derivation
}