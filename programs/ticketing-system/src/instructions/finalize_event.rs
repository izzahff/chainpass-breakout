use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::TicketingError;
use crate::state::*;

#[derive(Accounts)]
pub struct FinalizeEvent<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            EVENT_SEED,
            event.name.as_bytes(),
            event.organizer.as_ref(),
        ],
        bump = event.bump,
        constraint = event.organizer == organizer.key() @ TicketingError::NotOrganizer,
        constraint = !event.is_finalized @ TicketingError::EventAlreadyFinalized,
        constraint = (Clock::get()?.unix_timestamp >= event.event_date) @ TicketingError::EventNotEnded,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [
            VAULT_SEED,
            event.key().as_ref(),
        ],
        bump,
    )]
    /// CHECK: This is a PDA that holds the SOL for tickets
    pub vault: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<FinalizeEvent>) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let organizer = &ctx.accounts.organizer;
    let vault = &ctx.accounts.vault;
    
    // Mark the event as finalized
    event.is_active = false;
    event.is_finalized = true;
    
    // Transfer all remaining SOL from vault to organizer
    let vault_balance = vault.lamports();
    **vault.try_borrow_mut_lamports()? = 0;
    **organizer.try_borrow_mut_lamports()? += vault_balance;
    
    msg!("Event {} finalized, {} SOL transferred to organizer", event.name, vault_balance as f64 / 1_000_000_000f64);
    
    Ok(())
}