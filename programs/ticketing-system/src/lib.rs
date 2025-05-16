use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod ticketing_system {
    use super::*;

    pub fn initialize_event(
        ctx: Context<InitializeEvent>,
        event_name: String,
        ticket_price: u64,
        max_tickets: u32,
        event_date: i64,
    ) -> Result<()> {
        instructions::initialize_event::handler(ctx, event_name, ticket_price, max_tickets, event_date)
    }

    pub fn buy_ticket(
        ctx: Context<BuyTicket>,
        ticket_metadata_uri: String,
    ) -> Result<()> {
        instructions::buy_ticket::handler(ctx, ticket_metadata_uri)
    }

    pub fn refund_ticket(ctx: Context<RefundTicket>) -> Result<()> {
        instructions::refund_ticket::handler(ctx)
    }

    pub fn finalize_event(ctx: Context<FinalizeEvent>) -> Result<()> {
        instructions::finalize_event::handler(ctx)
    }
}