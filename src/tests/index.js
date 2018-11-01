import { expect, assert } from "chai";
import { fetchGraphQL, fetchRest } from "./helpers.js"

var start = 1528470720000;
var end = new Date().getTime();

describe("CoinCap GraphQL",  () => {

	it("/assets",async () => {
		let rest = fetchRest("/assets");
		let gql = fetchGraphQL(`
			{
				assets {
					id,
					rank,
					symbol,
					name,
					supply,
					maxSupply,
					marketCapUsd,
					volumeUsd24Hr,
					priceUsd,
					changePercent24Hr,
					vwap24Hr
				}
			}`)
		.then(json => json.data.assets);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});

	it("/assets?offset=10",async () => {
		let rest = fetchRest("/assets?offset=10");
		let gql = fetchGraphQL(`
			{
				assets(offset: 10) {
					id,
					rank,
					symbol,
					name,
					supply,
					maxSupply,
					marketCapUsd,
					volumeUsd24Hr,
					priceUsd,
					changePercent24Hr,
					vwap24Hr
				}
			}`)
		.then(json => json.data.assets);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it("/assets?limit=10&offset=10",async () => {
		let rest = fetchRest("/assets?limit=10&offset=10");
		let gql = fetchGraphQL(`
			{
				assets(limit: 10, offset: 10) {
					id,
					rank,
					symbol,
					name,
					supply,
					maxSupply,
					marketCapUsd,
					volumeUsd24Hr,
					priceUsd,
					changePercent24Hr,
					vwap24Hr
				}
			}`)
		.then(json => json.data.assets);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});

	it("/assets/bitcoin",async () => {
		let rest = fetchRest("/assets/bitcoin");
		let gql = fetchGraphQL(`
			{
				asset(id: "bitcoin") {
					id,
					rank,
					symbol,
					name,
					supply,
					maxSupply,
					marketCapUsd,
					volumeUsd24Hr,
					priceUsd,
					changePercent24Hr,
					vwap24Hr
				}
			}`)
		.then(json => json.data.asset);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it("/assets/bitcoin/history?interval=d1",async () => {
		let rest = fetchRest("/assets/bitcoin/history?interval=d1");
		let gql = fetchGraphQL(`
			{
				assetHistory(id: "bitcoin", interval: d1) {
					priceUsd,
					time
				}
			}`)
		.then(json => json.data.assetHistory);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it(`/assets/bitcoin/history?interval=d1&start=${start}&end=${end}`, async () => {
		let rest = fetchRest(`/assets/bitcoin/history?interval=d1&start=${start}&end=${end}`);
		let gql = fetchGraphQL(`
			{
				assetHistory(id: "bitcoin", interval: d1, start: "${start}", end: "${end}") {
					priceUsd,
					time
				}
			}`)
		.then(json => json.data.assetHistory)

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it("/assets/bitcoin/markets",async () => {
		let rest = fetchRest("/assets/bitcoin/markets");
		let gql = fetchGraphQL(`
			{
				assetMarkets(id: "bitcoin") {
					exchangeId,
					baseId,
					quoteId,
					baseSymbol,
					quoteSymbol,
					volumeUsd24Hr,
					priceUsd,
					volumePercent
				}
			}`)
		.then(json => json.data.assetMarkets);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it(`/assets/bitcoin/markets?limit=10&offset=10`, async () => {
		let rest = fetchRest(`/assets/bitcoin/markets?limit=10&offset=10`);
		let gql = fetchGraphQL(`
			{
				assetMarkets(id: "bitcoin", limit: 10, offset: 10) {
					exchangeId,
					baseId,
					quoteId,
					baseSymbol,
					quoteSymbol,
					volumeUsd24Hr,
					priceUsd,
					volumePercent
				}
			}`)
		.then(json => json.data.assetMarkets)

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it("/rates",async () => {
		let rest = fetchRest("/rates");
		let gql = fetchGraphQL(`
			{
				rates {
					id,
					symbol,
					currencySymbol,
					type,
					rateUsd
				}
			}`)
		.then(json => json.data.rates);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});


	it("/rates/bitcoin",async () => {
		let rest = fetchRest("/rates/bitcoin");
		let gql = fetchGraphQL(`
			{
				rate(id: "bitcoin") {
					id,
					symbol,
					currencySymbol,
					type,
					rateUsd
				}
			}`)
		.then(json => json.data.rate);

		let [r,g] = await Promise.all([rest, gql]);
		expect(r).to.deep.equal(g);
	});

	it("/exchanges",async () => {
		let rest = fetchRest("/exchanges")
		.then(exchanges => exchanges.map(e => e = { ...e, updated: String(e.updated) } ))

		let gql = fetchGraphQL(`
			{
				exchanges {
					exchangeId,
					name,
					rank,
					percentTotalVolume,
					volumeUsd,
					tradingPairs,
					socket,
					exchangeUrl,
					updated
				}
			}`)
		.then(json => json.data.exchanges)

		let [r,g] = await Promise.all([rest, gql]);

		expect(r).to.deep.equal(g);
	});


	it("/exchanges/kraken",async () => {
		let rest = fetchRest("/exchanges/kraken")
		.then(e => e = { ...e, updated: String(e.updated) })

		let gql = fetchGraphQL(`
			{
				exchange(id: "kraken") {
					exchangeId,
					name,
					rank,
					percentTotalVolume,
					volumeUsd,
					tradingPairs,
					socket,
					exchangeUrl,
					updated
				}
			}`)
		.then(json => json.data.exchange)

		let [r,g] = await Promise.all([rest, gql]);

		expect(r).to.deep.equal(g);
	});

	it("/markets",async () => {
		let rest = fetchRest("/markets")
		.then(markets => markets.map(m => m = { ...m, updated: String(m.updated) } ))

		let gql = fetchGraphQL(`
			{
				markets {
					exchangeId,
					rank,
					baseSymbol,
					baseId,
					quoteSymbol,
					quoteId,
					priceQuote,
					priceUsd,
					volumeUsd24Hr,
					percentExchangeVolume,
					tradesCount24Hr,
					updated
				}
			}`)
		.then(json => json.data.markets)

		let [r,g] = await Promise.all([rest, gql]);

		expect(r).to.deep.equal(g);
	});

	it("/markets?exchangeId=poloniex&baseSymbol=BTC&quoteSymbol=ETH",async () => {
		let rest = fetchRest("/markets?exchangeId=poloniex&baseSymbol=BTC&quoteSymbol=ETH")
		.then(markets => markets.map(m => m = { ...m, updated: String(m.updated) } ))

		let gql = fetchGraphQL(`
			{
				markets(exchangeId: "poloniex", baseSymbol: "BTC", quoteSymbol: "ETH") {
					exchangeId,
					rank,
					baseSymbol,
					baseId,
					quoteSymbol,
					quoteId,
					priceQuote,
					priceUsd,
					volumeUsd24Hr,
					percentExchangeVolume,
					tradesCount24Hr,
					updated
				}
			}`)
		.then(json => json.data.markets)

		let [r,g] = await Promise.all([rest, gql]);

		expect(r).to.deep.equal(g);
	});

	it("/candles?exchange=poloniex&interval=h8&baseId=ethereum&quoteId=bitcoin",async () => {
		let rest = fetchRest("/candles?exchange=poloniex&interval=h8&baseId=ethereum&quoteId=bitcoin")
		.then(candles => candles.map(c => c = { ...c, period: String(c.period) } ))

		let gql = fetchGraphQL(`
			{
				candles(exchange: "poloniex", interval: h8, baseId: "ethereum", quoteId: "bitcoin") {
					open,
					high,
					low,
					close,
					volume,
					period
				}
			}`)
		.then(json => json.data.candles)

		let [r,g] = await Promise.all([rest, gql]);

		expect(r).to.deep.equal(g);
	});

});
