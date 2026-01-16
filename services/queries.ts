import { api } from "./api";
import {
  MarketCoin,
  TrendingResponse,
  CoinDetails,
  Favorite,
} from "@/types/types";

/* ======================
   COINS
====================== */

export const fetchMarketCoins = () =>
  api<MarketCoin[]>("/api/coins/market");

export const fetchTrendingCoins = () =>
  api<TrendingResponse>("/api/coins/trending");

export const fetchCoinDetails = (id: string) =>
  api<CoinDetails>(`/api/coins/${id}`);

/* ======================
   FAVORITES
====================== */

export const fetchFavorites = () =>
  api<MarketCoin[]>("/api/coins/favorites");

export const addFavorite = (coinId: string) =>
  api<Favorite>("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ coinId, chainId: "ethereum", address: "0x0" }),
  });

export const removeFavorite = (coinId: string) =>
  api<{ success: boolean }>(`/api/favorites?coinId=${coinId}`, {
    method: "DELETE",
  });
