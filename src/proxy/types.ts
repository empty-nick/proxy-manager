export type ParseProxiesBody = {
  address: Array<string>;
};

export type ResponseStatus = {
  status: 'sucsex' | 'failed';
  done: boolean;
};

export type GeonodeResponseType = {
  _id: string;
  ip: string;
  anonymityLevel: string;
  asn: string;
  city: string;
  country: string;
  created_at: string;
  google: boolean;
  isp: string;
  lastChecked: number;
  latency: number;
  org: string;
  port: string;
  protocols: string[];
  speed: number;
  upTime: number;
  upTimeSuccessCount: number;
  upTimeTryCount: number;
  updated_at: string;
  responseTime: number;
};
