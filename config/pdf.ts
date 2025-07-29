import path from 'path';

/**
 * PDF Generation Configuration for IFTA Reports
 * Production-ready settings for professional PDF generation
 */

export const pdfConfig = {
  // Storage Configuration
  storage: {
    provider: process.env.PDF_STORAGE_PROVIDER || 'filesystem',
    basePath: path.join(process.cwd(), 'uploads', 'ifta-pdfs'),
    tempPath: path.join(process.cwd(), 'tmp', 'ifta-pdfs'),
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      publicUrl: process.env.S3_PUBLIC_URL,
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['pdf'],
  },

  // PDF Template Configuration
  templates: {
    fonts: {
      regular: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique',
    },
    colors: {
      primary: { r: 0, g: 0, b: 0 },
      secondary: { r: 0.5, g: 0.5, b: 0.5 },
      accent: { r: 0.2, g: 0.4, b: 0.8 },
      success: { r: 0, g: 0.6, b: 0 },
      error: { r: 0.8, g: 0, b: 0 },
    },
    layout: {
      pageSize: {
        width: 612, // 8.5"
        height: 792, // 11"
      },
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      lineHeight: 15,
      columnSpacing: 10,
    },
  },

  // Digital Signature Configuration
  signatures: {
    enabled: true,
    defaultPosition: { x: 50, y: 100 },
    signatureBox: {
      width: 200,
      height: 50,
      borderWidth: 1,
    },
  },

  watermark: {
    enabled: false,
    text: 'OFFICIAL',
    opacity: 0.1,
    fontSize: 48,
    rotation: 45,
    position: { x: 200, y: 400 },
  },

  // Compliance Settings
  compliance: {
    iftaStandards: {
      requireDigitalSignature: true,
      requireOfficialLogo: true,
      requireTimestamp: true,
      auditTrail: true,
    },
    retentionPeriod: {
      years: 7, // IFTA requirement
      autoArchive: true,
    },
  },

  // Performance Optimization
  performance: {
    enableCompression: true,
    optimizeImages: true,
    maxConcurrentGenerations: 3,
    timeoutMs: 30000, // 30 seconds
  },

  // Formatting Settings
  formatting: {
    currency: {
      locale: 'en-US',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3, // For tax rates
    },
    numbers: {
      locale: 'en-US',
      useGrouping: true,
    },
    dates: {
      locale: 'en-US',
      format: 'MM/dd/yyyy',
    },
  },
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV;

  const configs = {
    development: {
      watermark: {
        enabled: true,
        text: 'DEVELOPMENT',
        opacity: 0.2,
      },
      performance: {
        timeoutMs: 60000,
      },
    },
    test: {
      storage: {
        basePath: path.join(process.cwd(), 'test-uploads', 'ifta-pdfs'),
      },
      performance: {
        maxConcurrentGenerations: 1,
      },
    },
    production: {
      compliance: {
        iftaStandards: {
          requireDigitalSignature: true,
          auditTrail: true,
        },
      },
      performance: {
        enableCompression: true,
        optimizeImages: true,
      },
    },
  };

  return configs[env as keyof typeof configs] || {};
};

// Merged configuration with environment overrides
export const mergedConfig = {
  ...pdfConfig,
  ...getEnvironmentConfig(),
};

export default pdfConfig;