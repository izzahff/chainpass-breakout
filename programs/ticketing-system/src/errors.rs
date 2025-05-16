use anchor_lang::prelude::*;

#[error_code]
pub enum TicketingError {
    #[msg("Event is not active")]
    EventNotActive,

    #[msg("Event has already ended")]
    EventEnded,

    #[msg("Not enough SOL to buy ticket")]
    InsufficientFunds,

    #[msg("Event is at maximum capacity")]
    EventAtCapacity,

    #[msg("Only the organizer can finalize an event")]
    NotOrganizer,

    #[msg("Event has not ended yet")]
    EventNotEnded,

    #[msg("User does not own this ticket")]
    NotTicketOwner,

    #[msg("The ticket has already been refunded")]
    TicketAlreadyRefunded,

    #[msg("Failed to mint NFT ticket")]
    NftMintFailed,

    #[msg("Failed to burn NFT ticket")]
    NftBurnFailed,

    #[msg("Failed to transfer SOL to user")]
    SolTransferFailed,

    #[msg("Event name is too long")]
    EventNameTooLong,

    #[msg("Invalid ticket price")]
    InvalidTicketPrice,

    #[msg("Event has already been finalized")]
    EventAlreadyFinalized,
}