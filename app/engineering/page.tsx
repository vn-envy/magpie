import { redirect } from "next/navigation";

export default async function EngineeringRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const map: Record<string, string> = {
    runs: "runs",
    drift: "overview",
    artifacts: "evidence",
    brightdata: "brightdata",
  };
  redirect(`/admin?tab=${tab ? (map[tab] ?? "overview") : "overview"}`);
}
