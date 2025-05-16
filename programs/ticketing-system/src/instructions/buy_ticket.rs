use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, Mint, TokenAccount};
use mpl_token_metadata::instruction::{create_metadata_accounts_v3, create_master_edition_v3};

use crate::constants::*;
use crate::errors::TicketingError;
use crate::state::*;

#[derive(Accounts)]
#[instruction(ticket_metadata_uri: String)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

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
        constraint = event.tickets_sold < event.max_tickets @ TicketingError::EventAtCapacity,
        constraint = Clock::get()?.unix_timestamp < event.event_date @ TicketingError::EventEnded,
    )]
    pub event: Account<'info, Event>,

    #[account(
        init,
        payer = buyer,
        space = 8 + 32 + 32 + 4 + 1 + 8 + 32 + 1,
        seeds = [
            TICKET_SEED,
            event.key().as_ref(),
            buyer.key().as_ref(),
        ],
        bump
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
    /// CHECK: This is a PDA that will hold the SOL for tickets
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub mint: Signer<'info>,

    #[account(
        init,
        payer = buyer,
        mint::decimals = 0,
        mint::authority = buyer,
        mint::freeze_authority = buyer,
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = buyer,
        associated_token::mint = token_mint,
        associated_token::authority = buyer,
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
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<BuyTicket>,
    ticket_metadata_uri: String,
) -> Result<()> {
    let event = &mut ctx.accounts.event;
    let ticket = &mut ctx.accounts.ticket;
    let buyer = &ctx.accounts.buyer;
    let vault = &ctx.accounts.vault;
    let clock = Clock::get()?;
    
    // Validate payment
    let payment_amount = event.ticket_price;
    if buyer.lamports() < payment_amount {
        return Err(TicketingError::InsufficientFunds.into());
    }
    
    // Transfer SOL to the vault
    let transfer_ix = system_instruction::transfer(
        &buyer.key(),
        &vault.key(),
        payment_amount,
    );
    
    solana_program::program::invoke(
        &transfer_ix,
        &[
            buyer.to_account_info(),
            vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    
    // Initialize ticket data
    ticket.event = event.key();
    ticket.owner = buyer.key();
    ticket.ticket_number = event.tickets_sold + 1;
    ticket.is_used = false;
    ticket.purchase_date = clock.unix_timestamp;
    ticket.mint = ctx.accounts.token_mint.key();
    ticket.bump = *ctx.bumps.get("ticket").unwrap();
    
    // Create NFT metadata (simplified - in a real implementation this would use actual CPI to Metaplex)
    // This is a placeholder for the actual Metaplex CPI call
    // In a real implementation, you would use the proper Metaplex CPI calls
    let metadata_title = format!("Event Ticket #{}", ticket.ticket_number);
    let metadata_symbol = "TICKET".to_string();
    
    // Update event state
    event.tickets_sold += 1;
    
    msg!("Ticket #{} purchased for event {}", ticket.ticket_number, event.name);
    
    Ok(())
}