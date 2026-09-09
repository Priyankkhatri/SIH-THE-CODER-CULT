import math, json

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2.0)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2.0)**2
    return R * 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

def cosine_sim(v1, v2):
    dot = sum(a*b for a,b in zip(v1, v2))
    n1 = math.sqrt(sum(a*a for a in v1))
    n2 = math.sqrt(sum(b*b for b in v2))
    return dot / (n1 * n2) if n1 > 0 and n2 > 0 else 0.0

class HeritageVisualEngine:
    def __init__(self, threshold=0.72):
        self.monuments = []
        self.threshold = threshold

    def add(self, m_id, name, lat, lon, vectors, meta):
        self.monuments.append({'id': m_id, 'name': name, 'lat': lat, 'lon': lon, 'vectors': vectors, 'meta': meta})

    def query(self, q_vec, u_lat, u_lon, radius_km=3.0):
        # 1. Geofence
        cands = [(m, haversine_distance(u_lat, u_lon, m['lat'], m['lon'])) for m in self.monuments]
        in_radius = [c for c in cands if c[1] <= radius_km]
        if not in_radius:
            return {'status': 'OUT_OF_GEOFENCE', 'msg': 'No monuments within radius'}

        # 2. Vector Search
        best_m, best_sim, best_dist = None, -1.0, 0.0
        for m, dist in in_radius:
            for v in m['vectors']:
                s = cosine_sim(q_vec, v)
                if s > best_sim:
                    best_sim, best_m, best_dist = s, m, dist

        if best_sim >= self.threshold:
            return {
                'status': 'VERIFIED_MATCH',
                'name': best_m['name'],
                'confidence': round(best_sim, 4),
                'distance_km': round(best_dist, 3),
                'sources': best_m['meta']['sources'],
                'historical_brief': best_m['meta']['brief']
            }
        return {'status': 'LOW_CONFIDENCE', 'best_guess': best_m['name'], 'confidence': round(best_sim, 4)}

if __name__ == '__main__':
    engine = HeritageVisualEngine()
    engine.add('N-DL-1', 'Qutub Minar', 28.5245, 77.1855, [[0.4, 0.5, 0.1, 0.8]], {
        'sources': ['Archaeological Survey of India (Delhi Circle)', 'UNESCO WHC Inscription 1993'],
        'brief': '72.5m fluted red sandstone minaret erected in 1192 CE by Qutb-ud-din Aibak.'
    })
    res = engine.query([0.41, 0.49, 0.11, 0.81], 28.5248, 77.1850)
    print(json.dumps(res, indent=2))
