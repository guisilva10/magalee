import { getAnalyticsData } from "@/server/sheet-data/get-analytics";
import AnalyticsClient from "./_components/analytics-client";

export default async function Page() {
  const analyticsData = await getAnalyticsData();

  return <AnalyticsClient data={analyticsData} />;
}
