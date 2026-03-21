import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  fallbackPricingUsageSnapshot,
  fetchPricingUsageSnapshot,
  type PricingUsageSnapshot,
} from "@/lib/pricing-usage";

export const usePricingUsage = () => {
  const { user } = useAuth();

  return useQuery<PricingUsageSnapshot>({
    queryKey: ["pricing-usage", user?.id ?? "anonymous"],
    queryFn: async () => {
      try {
        return await fetchPricingUsageSnapshot();
      } catch (_error) {
        return {
          ...fallbackPricingUsageSnapshot,
          fetchedAt: new Date().toISOString(),
        };
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};
