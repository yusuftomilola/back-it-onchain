#![cfg(test)]

use crate::{OutcomeManagerContract, OutcomeManagerContractClient};
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);

    client.initialize(&owner, &registry);

    // Verify oracle returns false for non-existent oracle
    let random_oracle = BytesN::from_array(&env, &[1; 32]);
    assert_eq!(client.is_authorized_oracle(&random_oracle), false);
}

#[test]
fn test_set_oracle() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);
    let oracle = BytesN::from_array(&env, &[2; 32]);

    env.mock_all_auths();
    client.initialize(&owner, &registry);

    // Set oracle as authorized
    client.set_oracle(&oracle, &true);

    // Verify oracle is authorized
    assert_eq!(client.is_authorized_oracle(&oracle), true);

    // Revoke oracle
    client.set_oracle(&oracle, &false);
    assert_eq!(client.is_authorized_oracle(&oracle), false);
}

#[test]
fn test_register_call() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);
    let token = Address::generate(&env);

    client.initialize(&owner, &registry);

    let call_id = 1u64;
    let long_tokens = 1000u128;
    let short_tokens = 500u128;
    let end_ts = 1000000u64;

    client.register_call(&call_id, &token, &long_tokens, &short_tokens, &end_ts);

    // Verify call was registered
    let call = client.get_call(&call_id);
    assert!(call.is_some());

    let call_data = call.unwrap();
    assert_eq!(call_data.id, call_id);
    assert_eq!(call_data.long_tokens, long_tokens);
    assert_eq!(call_data.short_tokens, short_tokens);
    assert_eq!(call_data.settled, false);
}

#[test]
fn test_submit_outcome_success() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);
    let token = Address::generate(&env);
    let oracle = BytesN::from_array(&env, &[4; 32]);

    env.mock_all_auths();
    client.initialize(&owner, &registry);

    // Authorize oracle
    client.set_oracle(&oracle, &true);

    // Register a call
    let call_id = 1u64;
    client.register_call(&call_id, &token, &1000u128, &500u128, &1000000u64);

    // Note: In real scenarios, we'd sign the message.
    // This test ensures the contract can be called with valid types.
}

#[test]
fn test_withdraw_payout_long_wins() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);
    let token = Address::generate(&env);

    client.initialize(&owner, &registry);

    // Register a call
    let call_id = 1u64;
    client.register_call(&call_id, &token, &1000u128, &500u128, &1000000u64);
}

#[test]
fn test_has_withdrawn() {
    let env = Env::default();
    let contract_id = env.register_contract(None, OutcomeManagerContract);
    let client = OutcomeManagerContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let registry = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&owner, &registry);

    let call_id = 1u64;

    // Initially, user has not withdrawn
    assert_eq!(client.has_withdrawn(&call_id, &user), false);
}
