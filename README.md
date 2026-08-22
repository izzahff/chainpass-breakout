# ChainPass 🎟️

> Forked from [Emir Erfan's original repo](https://github.com/EmirErfan/chainpass-breakout). Collaborative project — **my contribution: front-end development using React + Tailwind CSS.**

**Front-End Developer | Breakout Hackathon 2025**

ChainPass is a blockchain-based ticketing app that lets organizers get event funding through ticket staking, while buyers can buy, sell, and redeem NFT tickets with the same value.

---

## 🚩 Problem Statement

- **Scalping** — scalpers buy up tickets and resell at inflated prices
- **No secure resale** — buyers don't have a transparent way to resell tickets while retaining the same value
- **Ticket fraud** — fake tickets sold to buyers, resulting in low ticket sales for organizers

## 💡 Solution

- Tickets are tied to NFTs with a fixed staking price
- NFT tickets are unique and can't be duplicated — each is connected to a wallet address
- Buyers can resell their NFT ticket for the same value they staked, eliminating scalping and price fluctuation

## 🏗️ System Architecture

1. Buyer stakes tokens equal to the ticket's value on the blockchain
2. NFT access is generated after the staking process
3. NFT access is given to the buyer
4. After the event ends, all NFT access is transferred to the organizer, who gains access to all tokens staked by buyers
5. If a buyer unstakes their token, the NFT access is burned
6. Buyers can also resell their NFT access to another buyer for the same amount of token originally staked

## ⛓️ Blockchain Features

| Feature | What it does |
|---|---|
| **NFT-based ticketing** | Ensures ownership, authenticity, and uniqueness; eliminates fraud; enables secure transfer |
| **Staking mechanism** | Users stake tokens to gain NFT access; promotes loyalty and engagement with perks based on staking amount/duration |
| **Staking-pegged NFT access** | NFT access value is pegged to the amount staked — solves scalping and eliminates price fluctuation |
| **Wallet integration** | Users connect their crypto wallet to store, trade, and present their NFT access — promotes ownership and portability |

## 🛠️ Tech Stack

- **Blockchain:** Solana
- **Frontend:** React, Tailwind CSS
- **Backend:** Rust

## 🙋‍♀️ My Role

- Built the front-end interface using React and Tailwind CSS for the decentralized ticketing platform

## 👥 Team

- **Emir Erfan** — Backend Developer
- **Izzah** — Front-End Developer
