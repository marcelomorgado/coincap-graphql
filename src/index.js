import express from 'express'
import graphqlHTTP from 'express-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import cors from 'cors'
import fetch from 'node-fetch';

const app = express()

app.use(cors())

const homePath = '/graphql'
const URL = 'http://localhost'
const PORT = 3001

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
		symbol: String,
		name: String
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

const resolvers = {
  Query: {
		assets: async (root, {limit, offset}) => {
			let url = `https://api.coincap.io/v2/assets`
			if(limit) url += `?limit=${limit}`
			if(offset) url += `&offset=${offset}`

			return await fetch()
			.then(res => res.json())
			.then(json => json.data)
    },
		asset: async (root, {id}) => {
			return await fetch(`https://api.coincap.io/v2/assets/${id}`)
			.then(res => res.json())
			.then(json => json.data)
    },
		assetHistory: async (root, {id, interval, start, end}) => {
			let url = `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}`;
			if(start) url += `&start=${start}`
			if(end) url += `&end=${end}`
			return await fetch(url)
			.then(res => res.json())
			.then(json => json.data)
    },
		assetMarkets: async (root, {id, limit, offset}) => {
			let url = `https://api.coincap.io/v2/assets/${id}/markets`;
			if(limit) url += `&limit=${limit}`
			if(offset) url += `&offset=${offset}`
			return await fetch(url)
			.then(res => res.json())
			.then(json => json.data)
		},
		rates: async (root, {}) => {
			return await fetch(`https://api.coincap.io/v2/rates`)
			.then(res => res.json())
			.then(json => json.data)
		},
		rate: async (root, {id}) => {
			return await fetch(`https://api.coincap.io/v2/rates/${id}`)
			.then(res => res.json())
			.then(json => json.data)
		},
		exchanges: async (root, {}) => {
			return await fetch(`https://api.coincap.io/v2/exchanges`)
			.then(res => res.json())
			.then(json => json.data)
		},
		exchange: async (root, {id}) => {
			return await fetch(`https://api.coincap.io/v2/exchanges/${id}`)
			.then(res => res.json())
			.then(json => json.data)
		},
		markets: async (root, {exchangeId,
			baseSymbol,
			quoteSymbol,
			baseId,
			quoteId,
			assetSymbol,
			assetId,
			limit,
			offset}
		) => {
			let url = `https://api.coincap.io/v2/markets`;
			if(exchangeId) url += `?exchangeId=${exchangeId}`
			if(baseSymbol) url += `&baseSymbol=${baseSymbol}`
			if(quoteSymbol) url += `&quoteSymbol=${quoteSymbol}`
			if(baseId) url += `&baseId=${baseId}`
			if(quoteId) url += `&quoteId=${quoteId}`
			if(assetSymbol) url += `&assetSymbol=${assetSymbol}`
			if(assetId) url += `&assetId=${assetId}`
			if(limit) url += `&limit=${limit}`
			if(offset) url += `&offset=${offset}`
			return await fetch(url)
			.then(res => res.json())
			.then(json => json.data)
		},
		candles: async (root, { exchange,
			interval,
			baseId,
			quoteId,
			start,
			end}
		) => {
			let url = `https://api.coincap.io/v2/candles`;
			if(exchange) url += `?exchange=${exchange}`
			if(interval) url += `&interval=${interval}`
			if(baseId) url += `&baseId=${baseId}`
			if(quoteId) url += `&quoteId=${quoteId}`
			if(start) url += `&start=${start}`
			if(end) url += `&end=${end}`

			return await fetch(url)
			.then(res => res.json())
			.then(json => json.data)
		}


  },

}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Visit ${URL}:${PORT}${homePath}`)
})
