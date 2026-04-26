# Dev Plan: CEX/DEX Settings Infrastructure + Persistence

## Date: 2024
## Status: In Progress

## Overview
Restructure the settings infrastructure to support both CEX and DEX connections with proper US-accessible filtering. Add persistent storage with localStorage (development) and document production database path.

## 1. Settings Data Model Restructure

### CEX Connections
- **Type**: Centralized exchanges (Coinbase Pro, Kraken, Binance US, Bybit, Deribit, OKX)
- **US-Accessible Filter**: Only exchanges that legally operate in the US
- **Fields**: id, name, icon, type (spot/futures/both), apiKey, apiSecret, apiKeyId, connected, network
- **Exchanges Removed**: FTX US (defunct/bankrupt)

### DEX Connections
- **Type**: Decentralized exchanges organized by asset
- **US-Accessible**: All DEXes are inherently US-accessible (no KYC)
- **Grid Layout**: Asset (ETH, SOL, BTC) × DEX (Uniswap, Jupiter, etc.)
- **Fields**: id, asset, dex, icon, connected, walletAddress, rpcUrl

### Prediction Platforms (unchanged)
- Kashi, Polymarket

## 2. Settings Context Updates

### New Types
```typescript
interface CEXConnection {
  id: string
  name: string
  icon: string
  type: 'spot' | 'futures' | 'both'
  apiKey: string
  apiSecret: string
  apiKeyId: string
  connected: boolean
  network: 'mainnet' | 'testnet'
}

interface DEXConnection {
  id: string
  asset: string
  dex: string
  icon: string
  connected: boolean
  walletAddress: string
  rpcUrl: string
}
```

### US-Accessible CEX Presets
- Coinbase Pro (🔵)
- Kraken (🟣)
- Binance US (🔶)
- Bybit US (🟠)
- Deribit (🔴)
- OKX US (🟢)

### US-Accessible DEX Presets
- **ETH**: Uniswap V3, Uniswap V2, Curve, SushiSwap, 1inch, Aave
- **SOL**: Jupiter, Raydium, Orca
- **BTC**: Uni

## 3. Settings Dialog Restructure

### Layout: Two-Column Grid (CEX | DEX)

**Left Column — CEX Connections:**
- Each exchange card with icon, name, type badge
- Three inputs: API Key, API Secret, API Key ID
- Toggle: Mainnet/Testnet
- "Test Connection" button with status indicator
- Connected exchanges get disconnect option

**Right Column — DEX Connections by Asset:**
- Grouped by asset (ETH, SOL, BTC, etc.)
- Each asset section lists associated DEXes
- Each DEX card:
  - Wallet address input (or "Connect Wallet" button)
  - RPC URL input (optional)
  - "Test Connection" button

**Bottom Section:**
- Prediction Platforms (unchanged)
- "Save All" button (wired to persistence)

## 4. Persistence Layer

### Development Phase (Current)
- **Mechanism**: localStorage
- **Keys**: 
  - `kashi_cex_connections`
  - `kashi_dex_connections`
  - `kashi_prediction_connections`
- **Behavior**: Auto-save on any state change, auto-load on mount
- **Limitation**: Data tied to browser/device, not synced across devices

### Production Phase (Future)
- **Mechanism**: PostgreSQL or MongoDB
- **User Data Structure**:
  ```
  users: {
    id (UUID),
    encrypted_api_keys (JWT or AES-256 encrypted string),
    encrypted_api_secrets,
    wallet_addresses,
    connected_exchanges (JSON array of IDs),
    connected_dexes (JSON array of IDs),
    created_at,
    updated_at
  }
  
  user_exchanges: {
    user_id (FK),
    exchange_id,
    api_key (encrypted),
    api_secret (encrypted),
    api_key_id (encrypted),
    connected (boolean),
    network (mainnet/testnet),
    created_at,
    updated_at
  }
  
  user_dexes: {
    user_id (FK),
    dex_id,
    wallet_address,
    rpc_url,
    connected (boolean),
    created_at,
    updated_at
  }
  ```

- **Encryption Required**:
  - API keys/secrets encrypted at rest with AES-256
  - Keys encrypted in transit with TLS/HTTPS
  - User session keys via JWT or OAuth2
  - Optional: Client-side encryption of sensitive fields before DB write

- **Alternative DB Options**:
  - **SQLite**: For smaller-scale/self-hosted deployments
  - **MongoDB**: For flexible schema and horizontal scaling
  - **PostgreSQL**: For relational integrity and enterprise features

- **Alternative: Firebase/Firestore**:
  - Easier real-time sync across devices
  - Built-in auth + encryption
  - Scaling handled by Google

## 5. File Changes

### Created/Updated Files
1. `src/context/settings.tsx` - Settings context with CEX/DEX types + localStorage persistence
2. `components/SettingsDialog.tsx` - Rebuilt with CEX/DEX sections
3. `src/lib/providers.tsx` - Updated to wrap SettingsProvider
4. `src/app/layout.tsx` - Updated to use Providers

### Sidebar Updates
- CEX section: Bot Dashboard, Market Overview, Analytics, Trade History, Settings
- No UI changes to sidebar itself (Settings button opens dialog)

## 6. User Experience Flow

### First-Time User:
1. Opens Settings → sees CEX/DEX grids with all presets
2. Connects Coinbase Pro → enters API key/secret → tests → connected
3. Connects Jupiter (SOL) → connects wallet → RPC auto-populates → tests → connected
4. Clicks "Save All" → state auto-saved to localStorage

### Returning User:
1. Opens Settings → sees all previously connected exchanges/DEXes
2. Can test, disconnect, update keys
3. State reloaded from localStorage on mount

### Production User:
1. Opens Settings → sees synced connections from backend
2. API keys fetched/saved via encrypted POST requests
3. Multi-device sync via real-time DB updates

## 7. Security Considerations (Production)

- **Never store raw API keys in localStorage or client-side**
- **Use backend proxy for all exchange API calls**
- **Encrypt sensitive data at rest (AES-256)**
- **Encrypt keys in transit (TLS 1.3)**
- **Rotate API keys regularly**
- **Implement rate limiting for test connections**
- **Audit logs for all connection changes**
- **Compliance with SEC/CFTC regulations for US users**

## 8. Next Steps (After This PR)

1. Build bot configuration pages (grid, DCA, market-making strategies)
2. Add exchange-specific order types support
3. Implement live price feeds via connected exchanges
4. Build prediction market API integration
5. Add multi-user support with auth (Supabase/Firebase)
6. Migrate from localStorage to PostgreSQL/MongoDB for production
