export class TrackGenerator {
  static generate(config: { width: number; height: number; complexity?: number; segments?: number }) {
    const complexity = config.complexity || 5;
    const segments = config.segments || 12;
    const center = { x: config.width / 2, y: config.height / 2 };
    const radius = Math.min(config.width, config.height) * 0.4;

    // Generate random control points
    const points = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const variance = radius * (0.3 + Math.random() * 0.7);
      points.push({
        x: center.x + Math.cos(angle) * variance,
        y: center.y + Math.sin(angle) * variance,
      });
    }

    // Create smooth spline through points
    const trackPoints = [];
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];

      for (let t = 0; t < 1; t += 0.1) {
        trackPoints.push(this.catmullRom(p0, p1, p2, p3, t));
      }
    }

    return {
      outerPolygon: this.createOffsetPolygon(trackPoints, 80),
      innerPolygon: this.createOffsetPolygon(trackPoints, 40),
      checkpoints: this.createCheckpoints(trackPoints),
    };
  }

  private static catmullRom(p0: any, p1: any, p2: any, p3: any, t: number) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x:
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
      y:
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    };
  }

  private static createOffsetPolygon(points: any[], offset: number) {
    const polygon = [];
    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const curr = points[i];
      const next = points[(i + 1) % points.length];

      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };

      const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

      const n1 = { x: -v1.y / len1, y: v1.x / len1 };
      const n2 = { x: -v2.y / len2, y: v2.x / len2 };

      const tangent = {
        x: (n1.x + n2.x) * 0.5,
        y: (n1.y + n2.y) * 0.5,
      };
      const len = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
      const normal =
        len > 0
          ? {
              x: (tangent.x / len) * offset,
              y: (tangent.y / len) * offset,
            }
          : { x: 0, y: 0 };

      polygon.push({ x: curr.x + normal.x, y: curr.y + normal.y });
    }
    return polygon;
  }

  private static createCheckpoints(points: any[]) {
    const checkpoints = [];
    const segmentLength = Math.floor(points.length / 10);
    for (let i = 0; i < points.length; i += segmentLength) {
      checkpoints.push({
        position: points[i],
        width: 60,
        rotation: Math.atan2(
          points[(i + 1) % points.length].y - points[i].y,
          points[(i + 1) % points.length].x - points[i].x
        ),
      });
    }
    return checkpoints;
  }
}
