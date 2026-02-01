export interface EbaySimilarItem {
  title: string;
  price: string;
  currency: string;
  date: string;
  link: string;
  imageUrl: string;
}

const EBAY_APP_ID = process.env.EBAY_APP_ID || "";
const EBAY_BASE_URL = "https://svcs.ebay.com/services/search/FindingService/v1";

export async function searchSimilarItems(
  objectName: string
): Promise<EbaySimilarItem[]> {
  if (!EBAY_APP_ID) {
    console.warn("EBAY_APP_ID not set, returning empty results");
    return [];
  }

  const params = new URLSearchParams({
    "OPERATION-NAME": "findCompletedItems",
    "SERVICE-VERSION": "1.0.0",
    "SECURITY-APPNAME": EBAY_APP_ID,
    "RESPONSE-DATA-FORMAT": "JSON",
    "REST-PAYLOAD": "",
    keywords: objectName,
    "itemFilter(0).name": "SoldItemsOnly",
    "itemFilter(0).value": "true",
    "sortOrder": "EndTimeSoonest",
    "paginationInput.entriesPerPage": "5",
  });

  const response = await fetch(`${EBAY_BASE_URL}?${params}`);
  if (!response.ok) {
    console.error("eBay API error:", response.status);
    return [];
  }

  const data: any = await response.json();
  const results =
    data?.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item;

  if (!results || !Array.isArray(results)) {
    return [];
  }

  return results.map((item: any) => ({
    title: item.title?.[0] || "",
    price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "0",
    currency:
      item.sellingStatus?.[0]?.currentPrice?.[0]?.["@currencyId"] || "EUR",
    date: item.listingInfo?.[0]?.endTime?.[0] || "",
    link: item.viewItemURL?.[0] || "",
    imageUrl: item.galleryURL?.[0] || "",
  }));
}
