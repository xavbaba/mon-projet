import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export interface AnalysisRow {
  id: string;
  user_id: string;
  name: string;
  epoch: string;
  usage: string;
  estimated_value: string;
  description: string;
  similar_items: any;
  image_uri: string;
  created_at: string;
}

export async function saveAnalysis(userId: string, result: any): Promise<void> {
  const { error } = await getClient().from("analyses").insert({
    id: result.id,
    user_id: userId,
    name: result.name,
    epoch: result.epoch,
    usage: result.usage,
    estimated_value: result.estimatedValue,
    description: result.description,
    similar_items: result.similarItems || [],
    image_uri: result.imageUri || "",
    created_at: result.createdAt,
  });

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}

export async function getAnalysesForUser(userId: string): Promise<any[]> {
  const { data, error } = await getClient()
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return (data || []).map((row: AnalysisRow) => ({
    id: row.id,
    name: row.name,
    epoch: row.epoch,
    usage: row.usage,
    estimatedValue: row.estimated_value,
    description: row.description,
    similarItems: row.similar_items,
    imageUri: row.image_uri,
    createdAt: row.created_at,
  }));
}
