import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { NodeSDK } from "@opentelemetry/sdk-node";

import { env } from "../config/env.js";
import { logger } from "../core/logger.js";

let sdk: NodeSDK | undefined;

export const initializeTracing = async (): Promise<void> => {
  if (!env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    logger.info("OpenTelemetry exporter endpoint is not set; tracing is disabled");
    return;
  }

  sdk = new NodeSDK({
    serviceName: env.OTEL_SERVICE_NAME,
    traceExporter: new OTLPTraceExporter({
      url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT.replace(/\/$/, "")}/v1/traces`
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  await sdk.start();
  logger.info({ endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT }, "OpenTelemetry tracing initialized");
};

export const shutdownTracing = async (): Promise<void> => {
  if (!sdk) {
    return;
  }

  await sdk.shutdown();
  logger.info("OpenTelemetry tracing shut down");
};
