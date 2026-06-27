// Pure topology helper — no server imports, safe for client components.
import type {
  InfrastructureAsset,
  InfrastructureContainer,
  InfrastructureDashboard,
  InfrastructureService,
  TopologyNode,
} from "@/types/forgeonix-os";

/** Nest assets into host -> child trees, attaching containers/services per asset. */
export function buildTopology(
  dashboard: Pick<InfrastructureDashboard, "assets" | "containers" | "services">,
): TopologyNode[] {
  const { assets, containers, services } = dashboard;

  const containersByAsset = new Map<string, InfrastructureContainer[]>();
  for (const c of containers) {
    if (!c.asset_id) continue;
    const list = containersByAsset.get(c.asset_id) ?? [];
    list.push(c);
    containersByAsset.set(c.asset_id, list);
  }

  const servicesByAsset = new Map<string, InfrastructureService[]>();
  for (const s of services) {
    if (!s.asset_id) continue;
    const list = servicesByAsset.get(s.asset_id) ?? [];
    list.push(s);
    servicesByAsset.set(s.asset_id, list);
  }

  const childrenByParent = new Map<string, InfrastructureAsset[]>();
  const roots: InfrastructureAsset[] = [];
  for (const a of assets) {
    if (a.parent_id) {
      const list = childrenByParent.get(a.parent_id) ?? [];
      list.push(a);
      childrenByParent.set(a.parent_id, list);
    } else {
      roots.push(a);
    }
  }

  const seen = new Set<string>();
  const build = (asset: InfrastructureAsset): TopologyNode => {
    seen.add(asset.id);
    const children = (childrenByParent.get(asset.id) ?? []).filter((c) => !seen.has(c.id));
    return {
      asset,
      children: children.map(build),
      containers: containersByAsset.get(asset.id) ?? [],
      services: servicesByAsset.get(asset.id) ?? [],
    };
  };

  return roots.map(build);
}
