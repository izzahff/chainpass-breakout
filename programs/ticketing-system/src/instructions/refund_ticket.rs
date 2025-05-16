use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Mint, TokenAccount};

use crate::constants::*;
use crate::errors::TicketingError;
use crate::state::*;

#[derive(Accounts)]
pub struct RefundTicket<'info> {
    #[account(mut)]
    pub ticket_owner: Signer<'info>,

    #[account(
        mut,
        seeds = [
            EVENT_SEED,
            event.name.as_bytes(),
            event.organizer.as_ref(),
        ],
        bump = event.bump,
        constraint = event.is_active @ TicketingError::EventNotActive,
        constraint = !event.is_finalized @ TicketingError::EventAlreadyFinalized,
        constraint = Clock::get()?.unix_timestamp < event.event_date @ TicketingError::EventEnded,
    )]
    pub event: Account<'info, Event>,

    #[account(
        mut,
        seeds = [
            TICKET_SEED,
            event.key().as_ref(),
            ticket_owner.key().as_ref(),
        ],
        bump = ticket.bump,
        constraint = ticket.owner == ticket_owner.key() @ TicketingError::NotTicketOwner,
        constraint = !ticket.is_used @ TicketingError::TicketAlreadyRefunded,
        close = ticket_owner
    )]
    pub ticket: Account<'info, Ticket>,

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

    #[account(
        mut,
        constraint = token_mint.key() == ticket.mint,
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = token_account.mint == token_mint.key(),
        constraint = token_account.owner == ticket_owner.key(),
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: Metadata account for the NFT
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: Master edition account for the NFT
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    /// CHECK: Metadata program account
    pub token_metadata_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RefundTicket>) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let ticket = &mut ctx.accounts.ticket;
    let ticket_owner = &ctx.accounts.ticket_owner;
    let vault = &ctx.accounts.vault;
    
    // Mark the ticket as used (refunded)
    ticket.is_used = true;
    
    // Calculate the refund amount
    let refund_amount = event.ticket_price;
    
    // Burn the NFT (simplified - in a real implementation, this would use actual CPI to Metaplex)
    // This is a placeholder for the actual NFT burn operation
    // In a real implementation, you would use the proper token burn instruction
    
    // Transfer SOL from vault to ticket owner
    **vault.try_borrow_mut_lamports()? -= refund_amount;
    **ticket_owner.try_borrow_mut_lamports()? += refund_amount;
    
    // Update event state
    event.tickets_sold -= 1;
    
    msg!("Ticket #{} refunded for event {}", ticket.ticket_number, event.name);
    
    Ok(())
}