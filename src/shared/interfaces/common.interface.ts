export interface IEc2InstanceInfo {
    ami_id: string;
    hostname: string;
    instance_id: string;
    instance_type: string;
    local_hostname: string;
    local_ipv4: string;
    mac: string;
    public_hostname: string;
    public_ipv4: string;
  }

export interface IEc2RunningServerWithInstanceInfo extends IEc2InstanceInfo {
  domain_hostname: string,
  server_running_port_number:number
}
