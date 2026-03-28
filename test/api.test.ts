import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

const app = createApp();

describe("Central System API", () => {
  it("returns service overview on root route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.service).toBe("central-system-api");
    expect(response.body.endpoints.apiBase).toBe("/api/v1");
  });

  it("returns healthy status", async () => {
    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("lists seed ministries", async () => {
    const response = await request(app).get("/api/v1/ministries");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it("creates anonymous complaint and tracks it by ticket", async () => {
    const createResponse = await request(app).post("/api/v1/complaints").send({
      ministry: "mohp",
      category: "Service Delivery",
      message: "Medicine stock is unavailable for multiple days in local center.",
      isAnonymous: true
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.ticketId).toMatch(/^NPL-/);

    const ticketId: string = createResponse.body.data.ticketId;

    const trackResponse = await request(app).get(`/api/v1/complaints/${ticketId}`);

    expect(trackResponse.status).toBe(200);
    expect(trackResponse.body.data.status).toBe("submitted");
  });

  it("validates non-anonymous complaint payload", async () => {
    const response = await request(app).post("/api/v1/complaints").send({
      category: "Infrastructure",
      message: "Road segment has been blocked for over one week due to debris.",
      isAnonymous: false
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await request(app).get("/unknown");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});
