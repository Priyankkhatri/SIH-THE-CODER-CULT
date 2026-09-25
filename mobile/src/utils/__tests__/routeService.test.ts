import assert from 'node:assert/strict';
import { haversineDistance, optimizeStopSequence, calculateBearing } from '../routeService';

console.log('--- Running RouteService Accuracy Tests ---');

// 1. haversineDistance accuracy
{
  // Ahmedabad (23.0225, 72.5714) to Vadodara (22.3072, 73.1812)
  const dist = haversineDistance(23.0225, 72.5714, 22.3072, 73.1812);
  assert(dist > 95 && dist < 120, `Expected distance ~100-115km, got ${dist}`);
  console.log('✔ Ahmedabad -> Vadodara distance matches ground truth (~100km):', dist.toFixed(1), 'km');

  // Coincident points must equal 0
  const zeroDist = haversineDistance(22.3072, 73.1812, 22.3072, 73.1812);
  assert.equal(zeroDist, 0, 'Coincident points must have 0 distance');
  console.log('✔ Coincident points yield 0 km');

  // Negative / NaN / Infinity inputs must safely yield 0, not NaN
  assert.equal(haversineDistance(NaN, 73.1812, 22.3072, 73.1812), 0);
  assert.equal(haversineDistance(22.3072, Infinity, 22.3072, 73.1812), 0);
  console.log('✔ Non-finite coordinate inputs handled without NaN');

  // Antipodal points clamp without numerical error
  const antipodal = haversineDistance(90, 0, -90, 0);
  assert(antipodal > 19900 && antipodal < 20100, `Expected half-earth circumference ~20015km, got ${antipodal}`);
  console.log('✔ Antipodal points clamp domain safely');
}

// 2. optimizeStopSequence zero-bias protection
{
  const mockStops = [
    { id: 'stop-valid-near', name: 'Near Site', latitude: 22.31, longitude: 73.19 },
    { id: 'stop-missing-coords', name: 'Unknown Coords Site', latitude: undefined as any, longitude: undefined as any },
    { id: 'stop-valid-far', name: 'Far Site', latitude: 23.85, longitude: 72.10 },
  ];

  const optimized = optimizeStopSequence(22.3072, 73.1812, mockStops);
  assert.equal(optimized.length, 3, 'Must retain all stops');
  assert.equal(optimized[0].id, 'stop-valid-near', 'Near stop must be first');
  assert.equal(optimized[optimized.length - 1].id, 'stop-missing-coords', 'Missing coords must not steal front rank');
  console.log('✔ optimizeStopSequence prevents zero-distance bias for stops missing coordinates');
}

// 3. calculateBearing accuracy
{
  // Same point
  assert.equal(calculateBearing(22.0, 73.0, 22.0, 73.0), 0);
  console.log('✔ calculateBearing returns 0 for coincident points');

  // Due North (0 degrees)
  const bearingNorth = calculateBearing(22.0, 73.0, 23.0, 73.0);
  assert(Math.abs(bearingNorth - 0) < 0.1 || Math.abs(bearingNorth - 360) < 0.1);
  console.log('✔ Due North bearing ~0° verified:', bearingNorth);

  // Due East (90 degrees)
  const bearingEast = calculateBearing(0.0, 70.0, 0.0, 80.0);
  assert(Math.abs(bearingEast - 90) < 0.1);
  console.log('✔ Due East bearing ~90° verified:', bearingEast);
}

console.log('All RouteService tests passed successfully! ✅');
