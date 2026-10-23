import { BrowserRouter, Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

type MarketAsset = {
  id: string
  name: string
  symbol: string
  price: number
  change: number
  changePercent: number
  volume?: string
  marketCap?: string
  unit?: string
  type?: string
  issuer?: string
  maturity?: string
  currency?: string
  timestamp?: string
  sparkline?: number[]
  description?: string
  metricLabel?: string
  sector?: string
}

type NewsItem = {
  id: string
  headline: string
  publisher: string
  time: string
  market: string
  url: string
}

const stocks: MarketAsset[] = [
  { id: 'aapl', name: 'Apple', symbol: 'AAPL', price: 214.82, change: 2.41, changePercent: 1.13, volume: '63.2M', marketCap: '3.2T', unit: 'USD', type: 'Equity', sector: 'Technology', sparkline: [188, 191, 198, 201, 196, 203, 210, 214], description: 'Consumer electronics and services leader.', metricLabel: 'Price' },
  { id: 'msft', name: 'Microsoft', symbol: 'MSFT', price: 454.36, change: 5.62, changePercent: 1.25, volume: '26.1M', marketCap: '3.4T', unit: 'USD', type: 'Equity', sector: 'Software', sparkline: [420, 432, 438, 441, 446, 452, 454], description: 'Enterprise software and cloud computing platform.', metricLabel: 'Price' },
  { id: 'nvda', name: 'NVIDIA', symbol: 'NVDA', price: 138.5, change: 5.18, changePercent: 3.89, volume: '58.4M', marketCap: '3.4T', unit: 'USD', type: 'Equity', sector: 'Semiconductors', sparkline: [110, 116, 119, 121, 126, 131, 138], description: 'AI-focused semiconductor and GPU manufacturer.', metricLabel: 'Price' },
  { id: 'amzn', name: 'Amazon', symbol: 'AMZN', price: 187.14, change: -1.84, changePercent: -0.97, volume: '41.1M', marketCap: '1.97T', unit: 'USD', type: 'Equity', sector: 'Consumer retail', sparkline: [198, 195, 191, 194, 189, 188, 187], description: 'Global retail and cloud infrastructure business.', metricLabel: 'Price' },
  { id: 'googl', name: 'Alphabet', symbol: 'GOOGL', price: 176.28, change: 2.1, changePercent: 1.21, volume: '18.8M', marketCap: '2.17T', unit: 'USD', type: 'Equity', sector: 'Internet services', sparkline: [160, 164, 168, 170, 172, 175, 176], description: 'Digital advertising and cloud platform company.', metricLabel: 'Price' },
  { id: 'tsla', name: 'Tesla', symbol: 'TSLA', price: 251.8, change: -7.64, changePercent: -2.94, volume: '96.7M', marketCap: '805B', unit: 'USD', type: 'Equity', sector: 'Automotive', sparkline: [272, 268, 263, 260, 257, 255, 251], description: 'Electric vehicle and energy storage manufacturer.', metricLabel: 'Price' },
  { id: 'meta', name: 'Meta Platforms', symbol: 'META', price: 525.94, change: 11.42, changePercent: 2.21, volume: '17.5M', marketCap: '1.33T', unit: 'USD', type: 'Equity', sector: 'Internet services', sparkline: [470, 485, 492, 501, 510, 520, 525], description: 'Social media and digital advertising company.', metricLabel: 'Price' },
  { id: 'brk-b', name: 'Berkshire Hathaway', symbol: 'BRK-B', price: 432.6, change: 5.9, changePercent: 1.38, volume: '6.5M', marketCap: '938B', unit: 'USD', type: 'Equity', sector: 'Diversified', sparkline: [405, 415, 420, 425, 428, 432, 432], description: 'Conglomerate with insurance, rail, and energy exposure.', metricLabel: 'Price' },
]

const bonds: MarketAsset[] = [
  { id: 'us-10y', name: 'US Treasury 10Y', symbol: 'US10Y', price: 4.21, change: 0.07, changePercent: 1.69, unit: '%', type: 'Government yield benchmark', issuer: 'U.S. Treasury', maturity: '10Y', currency: 'USD', timestamp: '11:45 ET', sparkline: [3.8, 3.9, 4.1, 4.12, 4.16, 4.18, 4.21], description: 'Benchmark government bond yield used in pricing long-duration debt.', metricLabel: 'Yield' },
  { id: 'us-2y', name: 'US Treasury 2Y', symbol: 'US2Y', price: 4.08, change: 0.04, changePercent: 0.98, unit: '%', type: 'Government yield benchmark', issuer: 'U.S. Treasury', maturity: '2Y', currency: 'USD', timestamp: '11:45 ET', sparkline: [3.7, 3.8, 3.93, 3.96, 4.01, 4.05, 4.08], description: 'Front-end yield curve signal for policy expectations.', metricLabel: 'Yield' },
  { id: 'us-30y', name: 'US Treasury 30Y', symbol: 'US30Y', price: 4.55, change: 0.08, changePercent: 1.79, unit: '%', type: 'Government yield benchmark', issuer: 'U.S. Treasury', maturity: '30Y', currency: 'USD', timestamp: '11:45 ET', sparkline: [4.2, 4.23, 4.31, 4.4, 4.48, 4.53, 4.55], description: 'Long bond benchmark for mortgage and credit pricing.', metricLabel: 'Yield' },
  { id: 'gld-bond', name: 'Global Bond Fund', symbol: 'BND', price: 72.18, change: 0.26, changePercent: 0.36, unit: 'USD', type: 'Bond fund', issuer: 'iShares', maturity: 'Broad market', currency: 'USD', timestamp: '11:45 ET', sparkline: [71.4, 71.6, 71.9, 72.1, 72.2, 72.3, 72.18], description: 'Broad government and corporate bond fund exposure.', metricLabel: 'Price' },
  { id: 'jpn-10y', name: 'Japan 10Y Govt Bond', symbol: 'JP10Y', price: 1.09, change: -0.02, changePercent: -1.81, unit: '%', type: 'Country benchmark', issuer: 'Japan Ministry of Finance', maturity: '10Y', currency: 'JPY', timestamp: '11:45 ET', sparkline: [1.34, 1.28, 1.19, 1.18, 1.15, 1.11, 1.09], description: 'Japanese yield benchmark for global fixed income investors.', metricLabel: 'Yield' },
  { id: 'ger-10y', name: 'Germany 10Y Bund', symbol: 'DE10Y', price: 2.79, change: 0.05, changePercent: 1.82, unit: '%', type: 'Country benchmark', issuer: 'Germany', maturity: '10Y', currency: 'EUR', timestamp: '11:45 ET', sparkline: [2.46, 2.52, 2.61, 2.7, 2.75, 2.78, 2.79], description: 'European core sovereign yield referencing inflation expectations.', metricLabel: 'Yield' },
]

const crypto: MarketAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 64212.4, change: 1188.5, changePercent: 1.89, volume: '$29.8B', marketCap: '$1.27T', unit: 'USD', type: 'Cryptocurrency', currency: 'USD', sparkline: [61000, 61800, 62100, 62900, 63200, 63890, 64212], description: 'Largest digital asset by market capitalization.', metricLabel: 'Price' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3526.12, change: 91.2, changePercent: 2.65, volume: '$14.7B', marketCap: '$423B', unit: 'USD', type: 'Cryptocurrency', currency: 'USD', sparkline: [3310, 3350, 3385, 3420, 3460, 3498, 3526], description: 'Smart contract platform powering decentralized apps.', metricLabel: 'Price' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 162.88, change: 7.42, changePercent: 4.78, volume: '$4.3B', marketCap: '$74.1B', unit: 'USD', type: 'Cryptocurrency', currency: 'USD', sparkline: [140, 148, 151, 155, 158, 160, 162], description: 'High-throughput blockchain with rapid transaction settlement.', metricLabel: 'Price' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', price: 0.62, change: 0.02, changePercent: 3.33, volume: '$2.2B', marketCap: '$35.8B', unit: 'USD', type: 'Cryptocurrency', currency: 'USD', sparkline: [0.52, 0.54, 0.56, 0.58, 0.6, 0.61, 0.62], description: 'Cross-border payment asset with strong liquidity.', metricLabel: 'Price' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.72, change: 0.03, changePercent: 4.32, volume: '$1.1B', marketCap: '$25.8B', unit: 'USD', type: 'Cryptocurrency', currency: 'USD', sparkline: [0.58, 0.61, 0.64, 0.68, 0.7, 0.71, 0.72], description: 'Proof-of-stake blockchain focused on decentralized finance.', metricLabel: 'Price' },
]

const indices: MarketAsset[] = [
  { id: 'spx', name: 'S&P 500', symbol: 'SPX', price: 5521.34, change: 32.45, changePercent: 0.59, unit: 'points', type: 'Index', currency: 'USD', sparkline: [5380, 5404, 5435, 5472, 5490, 5510, 5521], description: 'Broad U.S. large-cap equity benchmark.', metricLabel: 'Value' },
  { id: 'ndx', name: 'Nasdaq Composite', symbol: 'IXIC', price: 19642.1, change: 211.8, changePercent: 1.09, unit: 'points', type: 'Index', currency: 'USD', sparkline: [18840, 19020, 19150, 19380, 19480, 19580, 19642], description: 'Technology-heavy U.S. index.', metricLabel: 'Value' },
  { id: 'djia', name: 'Dow Jones Industrial Average', symbol: 'DJI', price: 40114.2, change: 144.6, changePercent: 0.36, unit: 'points', type: 'Index', currency: 'USD', sparkline: [39510, 39680, 39840, 39960, 40020, 40090, 40114], description: 'Blue-chip industrial benchmark.', metricLabel: 'Value' },
  { id: 'ftse', name: 'FTSE 100', symbol: 'FTSE', price: 8314.8, change: -18.4, changePercent: -0.22, unit: 'points', type: 'Index', currency: 'GBP', sparkline: [8390, 8388, 8366, 8338, 8322, 8318, 8314], description: 'Major UK equity benchmark.', metricLabel: 'Value' },
]

const commodities: MarketAsset[] = [
  { id: 'gold', name: 'Gold', symbol: 'XAU/USD', price: 2048.7, change: 11.4, changePercent: 0.56, unit: 'USD/oz', type: 'Commodity', currency: 'USD', volume: 'N/A', sparkline: [2004, 2012, 2021, 2028, 2038, 2041, 2048], description: 'Precious metal priced per troy ounce.', metricLabel: 'Price' },
  { id: 'silver', name: 'Silver', symbol: 'XAG/USD', price: 24.58, change: 0.31, changePercent: 1.28, unit: 'USD/oz', type: 'Commodity', currency: 'USD', volume: 'N/A', sparkline: [23.2, 23.5, 23.9, 24.1, 24.28, 24.42, 24.58], description: 'Industrial and precious metal consumption exposure.', metricLabel: 'Price' },
  { id: 'crude', name: 'WTI Crude', symbol: 'CL', price: 73.42, change: -1.08, changePercent: -1.45, unit: 'USD/bbl', type: 'Commodity', currency: 'USD', volume: 'N/A', sparkline: [77.1, 76.6, 75.8, 75.5, 74.9, 74.1, 73.42], description: 'Benchmark crude oil pricing for U.S. benchmark.', metricLabel: 'Price' },
  { id: 'natgas', name: 'Natural Gas', symbol: 'NG', price: 3.12, change: 0.09, changePercent: 2.97, unit: 'USD/MMBtu', type: 'Commodity', currency: 'USD', volume: 'N/A', sparkline: [2.66, 2.7, 2.88, 2.94, 3.02, 3.08, 3.12], description: 'Energy commodity sensitive to weather and inventory data.', metricLabel: 'Price' },
]

const forex: MarketAsset[] = [
  { id: 'eurusd', name: 'EUR/USD', symbol: 'EURUSD', price: 1.0842, change: 0.0018, changePercent: 0.17, unit: 'rate', type: 'Pair', currency: 'USD', sparkline: [1.078, 1.079, 1.081, 1.082, 1.083, 1.0837, 1.0842], description: 'Euro against U.S. dollar benchmark pair.', metricLabel: 'Rate' },
  { id: 'gbpusd', name: 'GBP/USD', symbol: 'GBPUSD', price: 1.2708, change: -0.0024, changePercent: -0.19, unit: 'rate', type: 'Pair', currency: 'USD', sparkline: [1.281, 1.279, 1.276, 1.274, 1.273, 1.272, 1.2708], description: 'British pound against U.S. dollar pair.', metricLabel: 'Rate' },
  { id: 'usdjpy', name: 'USD/JPY', symbol: 'USDJPY', price: 149.62, change: 0.34, changePercent: 0.23, unit: 'rate', type: 'Pair', currency: 'JPY', sparkline: [148.7, 148.9, 149.1, 149.18, 149.3, 149.52, 149.62], description: 'U.S. dollar against Japanese yen pair.', metricLabel: 'Rate' },
  { id: 'usdcad', name: 'USD/CAD', symbol: 'USDCAD', price: 1.3641, change: -0.0047, changePercent: -0.34, unit: 'rate', type: 'Pair', currency: 'CAD', sparkline: [1.37, 1.369, 1.3675, 1.3668, 1.3653, 1.3648, 1.3641], description: 'U.S. dollar against Canadian dollar pair.', metricLabel: 'Rate' },
]

const marketOverview = [
  { name: 'S&P 500', symbol: 'SPX', type: 'Index', value: '5,521.34', unit: 'points', change: '+0.59%' },
  { name: 'Nasdaq Composite', symbol: 'IXIC', type: 'Index', value: '19,642.10', unit: 'points', change: '+1.09%' },
  { name: 'US 10Y Treasury', symbol: 'US10Y', type: 'Bond yield', value: '4.21%', unit: '%', change: '+1.69%' },
  { name: 'Bitcoin', symbol: 'BTC', type: 'Cryptocurrency', value: '$64,212.40', unit: 'USD', change: '+1.89%' },
  { name: 'Ethereum', symbol: 'ETH', type: 'Cryptocurrency', value: '$3,526.12', unit: 'USD', change: '+2.65%' },
  { name: 'Gold', symbol: 'XAU/USD', type: 'Commodity', value: '$2,048.70', unit: 'USD/oz', change: '+0.56%' },
  { name: 'EUR/USD', symbol: 'EURUSD', type: 'Forex', value: '1.0842', unit: 'rate', change: '+0.17%' },
]

const newsItems: NewsItem[] = [
  { id: 'n1', headline: 'Technology stocks set pace after AI spending update lifts semiconductor outlook', publisher: 'MarketWire', time: '12 minutes ago', market: 'Semiconductors', url: 'https://example.com/news/1' },
  { id: 'n2', headline: 'Treasury yields hold firm as investors weigh inflation and policy expectations', publisher: 'Capital Journal', time: '34 minutes ago', market: 'Rates', url: 'https://example.com/news/2' },
  { id: 'n3', headline: 'Oil slips as supply outlook improves while demand remains uneven', publisher: 'Energy Desk', time: '1 hour ago', market: 'Commodities', url: 'https://example.com/news/3' },
  { id: 'n4', headline: 'Euro extends gains as growth outlook firmed by stronger external demand', publisher: 'FX Daily', time: '2 hours ago', market: 'Forex', url: 'https://example.com/news/4' },
  { id: 'n5', headline: 'Crypto market gains breadth as large-cap tokens recover from early-session volatility', publisher: 'Block Report', time: '3 hours ago', market: 'Crypto', url: 'https://example.com/news/5' },
]

const watchlist = [
  { id: 'aapl', name: 'Apple', symbol: 'AAPL', price: 214.82, change: 2.41, changePercent: 1.13 },
  { id: 'msft', name: 'Microsoft', symbol: 'MSFT', price: 454.36, change: 5.62, changePercent: 1.25 },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 64212.4, change: 1188.5, changePercent: 1.89 },
  { id: 'us-10y', name: 'US 10Y Treasury', symbol: 'US10Y', price: 4.21, change: 0.07, changePercent: 1.69 },
  { id: 'gold', name: 'Gold', symbol: 'XAU/USD', price: 2048.7, change: 11.4, changePercent: 0.56 },
]

const categoryMap = {
  stocks,
  bonds,
  crypto,
  indices,
  commodities,
  forex,
} as const

const marketCategories = [
  { title: 'Stocks', path: '/markets/stocks', count: stocks.length },
  { title: 'Bonds', path: '/markets/bonds', count: bonds.length },
  { title: 'Cryptocurrencies', path: '/markets/crypto', count: crypto.length },
  { title: 'Indices', path: '/markets/indices', count: indices.length },
  { title: 'Commodities', path: '/markets/commodities', count: commodities.length },
  { title: 'Forex', path: '/markets/forex', count: forex.length },
]

const allAssets = [...stocks, ...bonds, ...crypto, ...indices, ...commodities, ...forex]

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const [marketSearch, setMarketSearch] = useState('')

  return (
    <>
      <header className="app-header">
        <div className="brand-wrap">
          <div className="brand">Finor</div>
        </div>
        <nav className="primary-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/markets">Markets</NavLink>
          <NavLink to="/charts">Charts</NavLink>
          <NavLink to="/news">News</NavLink>
          <NavLink to="/analysis">Analysis</NavLink>
          <NavLink to="/watchlist">Watchlist</NavLink>
        </nav>
        <div className="header-search">
          <label htmlFor="market-search">Search Market</label>
          <input
            id="market-search"
            type="search"
            placeholder="Search market"
            value={marketSearch}
            onChange={(event) => setMarketSearch(event.target.value)}
          />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/markets" element={<MarketsOverviewPage />} />
          <Route path="/markets/:category" element={<MarketCategoryPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/charts/:symbol" element={<ChartDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analysis/:symbol" element={<AnalysisDetailPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

function formatPrice(value: number, unit?: string) {
  if (unit === '%') {
    return `${value.toFixed(2)}%`
  }
  if (unit === 'points') {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (unit === 'USD/oz' || unit === 'USD/bbl' || unit === 'USD/MMBtu' || unit === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: unit === 'USD' ? 2 : 2,
    }).format(value)
  }
  if (unit === 'rate') {
    return value.toFixed(4)
  }
  if (typeof value === 'number' && Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  return value.toFixed(2)
}

function formatSigned(value: number, digits = 2) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}`
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatSparkline(values: number[]) {
  if (!values.length) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return points
}

function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Market overview</p>
        <h1>{title}</h1>
      </div>
      <p className="page-description">{description}</p>
    </header>
  )
}

function HomePage() {
  return (
    <div className="page-shell">
      <PageHeader title="Market overview" description="Broad market discovery across equities, rates, commodities, currencies, and digital assets." />

      <section className="market-grid">
        {marketOverview.map((asset) => (
          <article key={asset.symbol} className="market-tile">
            <div className="tile-topline">
              <span className="instrument-type">{asset.type}</span>
              <span className="instrument-symbol">{asset.symbol}</span>
            </div>
            <h2>{asset.name}</h2>
            <div className="tile-price-row">
              <strong>{asset.value}</strong>
              <span className={asset.change.startsWith('+') ? 'positive' : 'negative'}>{asset.change}</span>
            </div>
            <p>{asset.unit}</p>
          </article>
        ))}
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Popular stocks</h2>
          <Link to="/markets/stocks">View All Stocks</Link>
        </div>
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Ticker</th>
                <th>Price</th>
                <th>Change</th>
                <th>%</th>
                <th>Volume</th>
                <th>Market cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 5).map((stock) => (
                <tr key={stock.id}>
                  <td><Link to={`/analysis/${stock.symbol.toLowerCase()}`}>{stock.name}</Link></td>
                  <td>{stock.symbol}</td>
                  <td>{formatPrice(stock.price, stock.unit)}</td>
                  <td className={stock.change >= 0 ? 'positive' : 'negative'}>{formatSigned(stock.change, 2)}</td>
                  <td className={stock.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(stock.changePercent)}</td>
                  <td>{stock.volume}</td>
                  <td>{stock.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Bonds</h2>
          <Link to="/markets/bonds">View All Bonds</Link>
        </div>
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Type</th>
                <th>Yield</th>
                <th>Yield change</th>
                <th>Currency</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {bonds.slice(0, 5).map((bond) => (
                <tr key={bond.id}>
                  <td>{bond.name}</td>
                  <td>{bond.type}</td>
                  <td>{formatPrice(bond.price, bond.unit)}</td>
                  <td className={bond.change >= 0 ? 'positive' : 'negative'}>{formatSigned(bond.change, 2)}</td>
                  <td>{bond.currency}</td>
                  <td>{bond.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Cryptocurrencies</h2>
          <Link to="/markets/crypto">View All Cryptocurrencies</Link>
        </div>
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th>%</th>
                <th>Volume</th>
                <th>Market cap</th>
              </tr>
            </thead>
            <tbody>
              {crypto.slice(0, 5).map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.symbol}</td>
                  <td>{formatPrice(asset.price, asset.unit)}</td>
                  <td className={asset.change >= 0 ? 'positive' : 'negative'}>{formatSigned(asset.change, 2)}</td>
                  <td className={asset.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(asset.changePercent)}</td>
                  <td>{asset.volume}</td>
                  <td>{asset.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Indices, commodities and forex</h2>
        </div>
        <div className="compact-grid">
          <div className="mini-table-card">
            <h3>Indices</h3>
            <table className="asset-table">
              <tbody>
                {indices.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{formatPrice(item.price, item.unit)}</td>
                    <td className={item.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(item.changePercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mini-table-card">
            <h3>Commodities</h3>
            <table className="asset-table">
              <tbody>
                {commodities.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{formatPrice(item.price, item.unit)}</td>
                    <td className={item.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(item.changePercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mini-table-card">
            <h3>Forex</h3>
            <table className="asset-table">
              <tbody>
                {forex.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{formatPrice(item.price, item.unit)}</td>
                    <td className={item.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(item.changePercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Latest financial news</h2>
          <Link to="/news">View All News</Link>
        </div>
        <ul className="news-list">
          {newsItems.map((article) => (
            <li key={article.id}>
              <div>
                <p className="article-meta">{article.publisher} · {article.time}</p>
                <h3>{article.headline}</h3>
              </div>
              <div className="article-link-row">
                <span>{article.market}</span>
                <a href={article.url} target="_blank" rel="noreferrer">Read article</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function MarketsOverviewPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Markets" description="Explore market categories with price discovery, sector leadership, and benchmark comparisons." />

      <div className="category-links">
        {marketCategories.map((category) => (
          <Link key={category.path} to={category.path}>
            <span>{category.title}</span>
            <span>{category.count} assets</span>
          </Link>
        ))}
      </div>

      <section className="content-section">
        <div className="section-header">
          <h2>Market summary</h2>
        </div>
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {marketOverview.map((asset) => (
                <tr key={asset.symbol}>
                  <td>{asset.name}</td>
                  <td>{asset.type}</td>
                  <td>{asset.value}</td>
                  <td className={asset.change.startsWith('+') ? 'positive' : 'negative'}>{asset.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function MarketCategoryPage() {
  const { category } = useParams()
  const categoryKey = (category ?? 'stocks') as keyof typeof categoryMap
  const assetData = categoryMap[categoryKey] ?? stocks
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('changePercent')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 220)
    return () => window.clearTimeout(timer)
  }, [category])

  useEffect(() => {
    setPage(1)
  }, [search, sortBy, category])

  const filteredAssets = useMemo(() => {
    const searchValue = search.trim().toLowerCase()
    const filtered = assetData.filter((asset) => {
      if (!searchValue) return true
      return [asset.name, asset.symbol, asset.issuer ?? '', asset.currency ?? '', asset.type ?? '']
        .join(' ')
        .toLowerCase()
        .includes(searchValue)
    })

    const sorted = [...filtered]
    sorted.sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.change - a.change
      if (sortBy === 'volume') {
        const aVolume = Number.parseFloat((a.volume ?? '0').replace(/[^\d.]/g, '')) || 0
        const bVolume = Number.parseFloat((b.volume ?? '0').replace(/[^\d.]/g, '')) || 0
        return bVolume - aVolume
      }
      if (sortBy === 'marketCap') {
        const aCap = parseMarketCap(a.marketCap ?? '0')
        const bCap = parseMarketCap(b.marketCap ?? '0')
        return bCap - aCap
      }
      return b.changePercent - a.changePercent
    })

    return sorted
  }, [assetData, search, sortBy])

  const pageSize = 8
  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / pageSize))
  const visibleAssets = filteredAssets.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="page-shell">
        <PageHeader title={titleForCategory(categoryKey)} description="Loading market data for the selected asset class." />
        <div className="state-panel">Loading market data...</div>
      </div>
    )
  }

  if (search.toLowerCase() === 'error') {
    return (
      <div className="page-shell">
        <PageHeader title={titleForCategory(categoryKey)} description="There was an issue while loading the market table." />
        <div className="state-panel error-state">Unable to load market data. Please try a different search or refresh the page.</div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <PageHeader title={titleForCategory(categoryKey)} description={descriptionForCategory(categoryKey)} />

      <div className="market-toolbar">
        <label className="search-field">
          <span>Asset search</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search instrument" />
        </label>

        <label className="search-field small-field">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="changePercent">Price change %</option>
            <option value="change">Absolute change</option>
            <option value="price">Price</option>
            {assetData.some((asset) => asset.volume) && <option value="volume">Trading volume</option>}
            {assetData.some((asset) => asset.marketCap) && <option value="marketCap">Market cap</option>}
          </select>
        </label>
      </div>

      {!visibleAssets.length ? (
        <div className="state-panel">No instruments match your search. Try a different asset name or ticker.</div>
      ) : (
        <>
          <div className="asset-table-wrap">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>{categoryKey === 'bonds' ? 'Yield' : categoryKey === 'indices' || categoryKey === 'commodities' || categoryKey === 'forex' ? 'Value' : 'Price'}</th>
                  <th>{categoryKey === 'bonds' ? 'Yield change' : 'Change'}</th>
                  <th>{categoryKey === 'bonds' ? 'Maturity' : 'Percent'}</th>
                  {categoryKey === 'stocks' || categoryKey === 'crypto' ? <th>Volume</th> : null}
                  {categoryKey === 'stocks' || categoryKey === 'crypto' ? <th>Market cap</th> : null}
                  {categoryKey === 'bonds' ? <th>Currency</th> : null}
                </tr>
              </thead>
              <tbody>
                {visibleAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td><Link to={categoryKey === 'stocks' || categoryKey === 'crypto' ? `/analysis/${asset.symbol.toLowerCase()}` : `/charts/${asset.symbol.toLowerCase()}`}>{asset.name}</Link></td>
                    <td>{asset.symbol}</td>
                    <td>{formatPrice(asset.price, asset.unit)}</td>
                    <td className={asset.change >= 0 ? 'positive' : 'negative'}>{formatSigned(asset.change, 2)}</td>
                    <td className={asset.changePercent >= 0 ? 'positive' : 'negative'}>{categoryKey === 'bonds' ? asset.maturity ?? 'N/A' : formatPercent(asset.changePercent)}</td>
                    {categoryKey === 'stocks' || categoryKey === 'crypto' ? <td>{asset.volume ?? 'N/A'}</td> : null}
                    {categoryKey === 'stocks' || categoryKey === 'crypto' ? <td>{asset.marketCap ?? 'N/A'}</td> : null}
                    {categoryKey === 'bonds' ? <td>{asset.currency ?? 'USD'}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-row">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>Previous</button>
            <span>Page {page} of {pageCount}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}>Next</button>
          </div>
        </>
      )}
    </div>
  )
}

function titleForCategory(category: string) {
  const titles: Record<string, string> = {
    stocks: 'Stocks',
    bonds: 'Bonds',
    crypto: 'Cryptocurrencies',
    indices: 'Indices',
    commodities: 'Commodities',
    forex: 'Foreign exchange',
  }
  return titles[category] ?? 'Markets'
}

function descriptionForCategory(category: string) {
  const descriptions: Record<string, string> = {
    stocks: 'Research U.S. and global equities by price, volume, and market capitalization.',
    bonds: 'Track sovereign and fixed income benchmarks with yield and duration comparisons.',
    crypto: 'Follow major crypto assets by trend, liquidity, and market scale.',
    indices: 'Track major index benchmarks and broad market sentiment across countries.',
    commodities: 'Monitor the price of natural resources and energy inputs in real time.',
    forex: 'Review major exchange rates and cross-currency trend signals.',
  }
  return descriptions[category] ?? 'Market insights across asset classes.'
}

function parseMarketCap(value: string) {
  if (!value) return 0
  const normalized = value.replace(/[$,]/g, '').toUpperCase()
  if (normalized.endsWith('T')) return Number.parseFloat(normalized) * 1_000_000_000_000
  if (normalized.endsWith('B')) return Number.parseFloat(normalized) * 1_000_000_000
  if (normalized.endsWith('M')) return Number.parseFloat(normalized) * 1_000_000
  return Number.parseFloat(normalized) || 0
}

function ChartsPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Charts" description="Monitor sector leadership, trend behavior, and market structure across asset classes." />
      <div className="chart-grid">
        {allAssets.slice(0, 8).map((asset) => (
          <Link key={asset.id} to={`/charts/${asset.symbol.toLowerCase()}`} className="chart-card">
            <div className="chart-header-line">
              <div>
                <span className="chart-symbol">{asset.symbol}</span>
                <h3>{asset.name}</h3>
              </div>
              <div className={asset.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(asset.changePercent)}</div>
            </div>
            <div className="chart-price-row">
              <strong>{formatPrice(asset.price, asset.unit)}</strong>
              <span>{formatSigned(asset.change, 2)}</span>
            </div>
            <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="sparkline">
              <polyline points={formatSparkline(asset.sparkline ?? [10, 12, 18, 16, 22, 28, 30])} />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ChartDetailPage() {
  const { symbol } = useParams()
  const asset = allAssets.find((item) => item.symbol.toLowerCase() === symbol?.toLowerCase())

  if (!asset) {
    return <NotFoundPage />
  }

  return (
    <div className="page-shell">
      <PageHeader title={`${asset.name} chart`} description={asset.description ?? 'Price and trend analysis for the selected asset.'} />
      <section className="detail-panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">{asset.type}</p>
            <h2>{asset.name} <span>({asset.symbol})</span></h2>
          </div>
          <div className="detail-price-block">
            <strong>{formatPrice(asset.price, asset.unit)}</strong>
            <span className={asset.change >= 0 ? 'positive' : 'negative'}>{formatSigned(asset.change, 2)} ({formatPercent(asset.changePercent)})</span>
          </div>
        </div>
        <svg viewBox="0 0 100 26" preserveAspectRatio="none" className="full-sparkline">
          <polyline points={formatSparkline(asset.sparkline ?? [5, 10, 12, 18, 16, 21, 25])} />
        </svg>
        <div className="detail-grid">
          <div>
            <span className="label">Market</span>
            <strong>{asset.type ?? 'Asset'}</strong>
          </div>
          <div>
            <span className="label">Volume</span>
            <strong>{asset.volume ?? 'N/A'}</strong>
          </div>
          <div>
            <span className="label">Market cap</span>
            <strong>{asset.marketCap ?? 'N/A'}</strong>
          </div>
          <div>
            <span className="label">Currency</span>
            <strong>{asset.currency ?? 'USD'}</strong>
          </div>
        </div>
      </section>
    </div>
  )
}

function NewsPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Financial news" description="Latest developments across markets, policy, and company earnings." />
      <ul className="news-archive">
        {newsItems.map((article) => (
          <li key={article.id}>
            <div className="article-headline-row">
              <span>{article.market}</span>
              <span>{article.time}</span>
            </div>
            <h2>{article.headline}</h2>
            <p>{article.publisher}</p>
            <a href={article.url} target="_blank" rel="noreferrer">View original article</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AnalysisPage() {
  return (
    <div className="page-shell">
      <PageHeader title="AI market analysis" description="Structured views covering macro factors, sector flow, and tradeable catalysts." />
      <div className="analysis-grid">
        {allAssets.slice(0, 6).map((asset) => (
          <article key={asset.id} className="analysis-card">
            <div className="analysis-head">
              <div>
                <p className="eyebrow">{asset.type}</p>
                <h3>{asset.name}</h3>
              </div>
              <span className={asset.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(asset.changePercent)}</span>
            </div>
            <p>
              {asset.name} remains {asset.changePercent >= 0 ? 'supported by' : 'under pressure from'} broad market flow and sector-level positioning.
            </p>
            <Link to={`/analysis/${asset.symbol.toLowerCase()}`}>Open Analysis</Link>
          </article>
        ))}
      </div>
    </div>
  )
}

function AnalysisDetailPage() {
  const { symbol } = useParams()
  const asset = allAssets.find((item) => item.symbol.toLowerCase() === symbol?.toLowerCase())

  if (!asset) {
    return <NotFoundPage />
  }

  return (
    <div className="page-shell">
      <PageHeader title={`${asset.name} analysis`} description="AI-generated market interpretation based on price action, trend, and risk context." />
      <section className="detail-panel analysis-panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">{asset.type}</p>
            <h2>{asset.name} <span>({asset.symbol})</span></h2>
          </div>
          <div className="detail-price-block">
            <strong>{formatPrice(asset.price, asset.unit)}</strong>
            <span className={asset.change >= 0 ? 'positive' : 'negative'}>{formatSigned(asset.change, 2)} ({formatPercent(asset.changePercent)})</span>
          </div>
        </div>

        <div className="analysis-copy">
          <p>
            {asset.name} is showing a {asset.changePercent >= 0 ? 'constructive' : 'defensive'} setup, with momentum aligned to the broader market backdrop and a directional bias shaped by recent {asset.type ? asset.type.toLowerCase() : 'asset'} flow.
          </p>
          <p>
            Key drivers include price support, liquidity conditions, and relative strength versus comparable instruments. Traders are monitoring the current {asset.symbol} range for continuation signals while keeping an eye on macro catalysts and market breadth.
          </p>
          <p>
            The tactical view remains {asset.changePercent >= 0 ? 'favorable for continuation' : 'cautious with protection on downside'} unless the market loses the short-term support structure around current levels.
          </p>
        </div>
      </section>
    </div>
  )
}

function WatchlistPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Watchlist" description="Track the instruments you are following most closely across markets and sectors." />
      <div className="asset-table-wrap">
        <table className="asset-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.symbol}</td>
                <td>{formatPrice(item.price, item.symbol.includes('US') ? '%' : item.symbol.includes('XAU') ? 'USD/oz' : 'USD')}</td>
                <td className={item.change >= 0 ? 'positive' : 'negative'}>{formatSigned(item.change, 2)}</td>
                <td className={item.changePercent >= 0 ? 'positive' : 'negative'}>{formatPercent(item.changePercent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="page-shell">
      <PageHeader title="Page not found" description="The route you requested is not available in this market platform." />
      <div className="state-panel">
        <p>Return to the homepage to explore available markets, charts, and news.</p>
        <Link to="/">Return home</Link>
      </div>
    </div>
  )
}

export default App
