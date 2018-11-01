import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import fetch from 'node-fetch';
import {
	COINCAP_API_URL,
	SERVICE_PATH,
	SERVICE_PORT
} from "./constants.js"

const app = express()

app.use(cors())

const typeDefs = [`
  type Query {
		assets(limit: Int, offset: Int): [Asset]
		asset(id: String!): Asset
		assetHistory(id: String!, interval: AssetHistoryInterval!, start: String, end: String): [AssetHistory]
		assetMarkets(id: String!, limit: Int, offset: Int): [AssetMarket]
    rates: [Rate]
		rate(id: String!): Rate
		exchanges: [Exchange]
		exchange(id: String!): Exchange
		markets(
			exchangeId: String,
			baseSymbol: String,
			quoteSymbol: String,
			baseId: String,
			quoteId: String,
			assetSymbol: String,
			assetId: String,
			limit: Int,
			offset: Int
		): [Market]
		candles(exchange: String!, interval: CandlesInterval!, baseId: String!, quoteId: String!, start: String, end: String): [Candle]
  }

	type Asset {
		id: String,
		rank: String,
		symbol: String,
		name: String,
		supply: String,
		maxSupply: String,
		marketCapUsd: String,
		volumeUsd24Hr: String,
		priceUsd: String,
		changePercent24Hr: String,
		vwap24Hr: String
	}

	enum AssetHistoryInterval {
	  m1
	  m15
	  h1
		d1
	}

	type AssetHistory {
		priceUsd: String,
		time: Float
	}

	type AssetMarket {
		exchangeId: String,
		baseId: String,
		quoteId: String,
		baseSymbol: String,
		quoteSymbol: String,
		volumeUsd24Hr: String,
		priceUsd: String,
		volumePercent: String
	}

	type Rate {
		id: String,
		symbol: String,
		currencySymbol: String,
		type: String,
		rateUsd: String
	}

	type Exchange {
		exchangeId: String,
		name: String,
		rank: String,
		percentTotalVolume: String,
		volumeUsd: String,
		tradingPairs: String,
		socket: Boolean,
		exchangeUrl: String,
		updated: String
	}

	type Market {
		exchangeId: String,
		rank: String,
		baseSymbol: String,
		baseId: String,
		quoteSymbol: String,
		quoteId: String,
		priceQuote: String,
		priceUsd: String,
		volumeUsd24Hr: String,
		percentExchangeVolume: String,
		tradesCount24Hr: String,
		updated: String
	}


	enum CandlesInterval {
	  m1
		m5
	  m15
	  m30
		h1
		h2
		h4
		h8
		h12
		d1
		w1
	}

	type Candle {
		open: String,
		high: String,
		low: String,
		close: String,
		volume: String,
		period: String
	}

  schema {
    query: Query
  }
`];

var buildUrl = (path, args = {}) => {
	let params = Object.keys(args)
	.filter(key => args[key])
	.map(key => `${key}=${args[key]}`).join('&');

	let url = `${COINCAP_API_URL}${path}`;
	if(params)
		url += `?${params}`

	return url;
}

const resolvers = {
  Query: {
		assets: async (root, {limit, offset}) => {
			return await fetch(buildUrl(`/assets`, {limit, offset}))
			.then(res => res.json())
			.then(json => json.data)
    },
		asset: async (root, {id}) => {
			return await fetch(buildUrl(`/assets/${id}`))
			.then(res => res.json())
			.then(json => json.data)
    },
		assetHistory: async (root, {id, interval, start, end}) => {
			return await fetch(buildUrl(`/assets/${id}/history`, { interval, start, end }))
			.then(res => res.json())
			.then(json => json.data)
    },
		assetMarkets: async (root, {id, limit, offset}) => {
			return await fetch(buildUrl(`/assets/${id}/markets`, { limit, offset }))
			.then(res => res.json())
			.then(json => json.data)
		},
		rates: async (root, {}) => {
			return await fetch(buildUrl(`/rates`))
			.then(res => res.json())
			.then(json => json.data)
		},
		rate: async (root, {id}) => {
			return await fetch(buildUrl(`/rates/${id}`))
			.then(res => res.json())
			.then(json => json.data)
		},
		exchanges: async (root, {}) => {
			return await fetch(buildUrl(`/exchanges`))
			.then(res => res.json())
			.then(json => json.data)
		},
		exchange: async (root, {id}) => {
			return await fetch(buildUrl(`/exchanges/${id}`))
			.then(res => res.json())
			.then(json => json.data)
		},
		markets: async (root, args
		) => {
			return await fetch(buildUrl(`/markets`, args))
			.then(res => res.json())
			.then(json => json.data)
		},
		candles: async (root, args) => {
			return await fetch(buildUrl(`/candles`, args))
			.then(res => res.json())
			.then(json => json.data)
		}
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use(SERVICE_PATH, graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(SERVICE_PORT, () => {
  console.log(`Visit http://localhost:${SERVICE_PORT}${SERVICE_PATH}`)
})
