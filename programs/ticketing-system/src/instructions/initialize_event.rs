use anchor_lang::prelude::*;
use anchor_lang::system_program;
use solana_program::system_instruction;

use crate::constants::*;
use crate::errors::TicketingError;
use crate::state::*;

#[derive(Accounts)]
#[instruction(
    event_name: String,
    ticket_price: u64,
    max_tickets: u32,
    event_date: i64
)]
pub struct InitializeEvent<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        init,
        payer = organizer,
        space = 8 + 32 + 4 + event_name.len() + 8 + 4 + 4 + 8 + 1 + 1 + 32 + 1,
        seeds = [
            EVENT_SEED,
            event_name.as_bytes(),
            organizer.key().as_ref(),
        ],
        bump
    )]
    pub event: Account<'info, Event>,

    #[account(
        seeds = [
            VAULT_SEED,
            event.key().as_ref(),
        ],
        bump,
    )]
    /// CHECK: This is a PDA that will hold the SOL for tickets
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeEvent>,
    event_name: String,
    ticket_price: u64,
    max_tickets: u32,
    event_date: i64,
) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let vault = &ctx.accounts.vault;
    let clock = Clock::get()?;
    
    // Validate inputs
    if event_name.len() > 50 {
        return Err(TicketingError::EventNameTooLong.into());
    }
    
    if ticket_price == 0 {
        return Err(TicketingError::InvalidTicketPrice.into());
    }
    
    if event_date <= clock.unix_timestamp {
        return Err(TicketingError::EventEnded.into());
    }
    
    // Initialize event data
    event.organizer = ctx.accounts.organizer.key();
    event.name = event_name;
    event.ticket_price = ticket_price;
    event.max_tickets = max_tickets;
    event.tickets_sold = 0;
    event.event_date = event_date;
    event.is_active = true;
    event.is_finalized = false;
    event.vault = vault.key();
    event.bump = *ctx.bumps.get("event").unwrap();
    
    msg!("Event initialized: {}", event.name);
    
    Ok(())
}