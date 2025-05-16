use anchor_lang::prelude::*;

pub const EVENT_SEED: &[u8] = b"event";
pub const TICKET_SEED: &[u8] = b"ticket";
pub const VAULT_SEED: &[u8] = b"vault";

// For calculating the bump seeds in PDAs
pub fn get_event_pda(
    event_name: &str,
    organizer: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            EVENT_SEED,
            event_name.as_bytes(),
            organizer.as_ref(),
        ],
        program_id,
    )
}

pub fn get_ticket_pda(
    event: &Pubkey,
    user: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            TICKET_SEED,
            event.as_ref(),
            user.as_ref(),
        ],
        program_id,
    )
}

pub fn get_vault_pda(
    event: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            VAULT_SEED,
            event.as_ref(),
        ],
        program_id,
    )
}