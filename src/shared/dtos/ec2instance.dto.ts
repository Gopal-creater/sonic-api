import { ApiProperty } from '@nestjs/swagger';

export class Ec2InstanceInfo {
    @ApiProperty()
    ami_id: string;

    @ApiProperty()
    hostname: string;

    @ApiProperty()
    instance_id: string;

    @ApiProperty()
    instance_type: string;

    @ApiProperty()
    local_hostname: string;

    @ApiProperty()
    local_ipv4: string;

    @ApiProperty()
    mac: string;

    @ApiProperty()
    public_hostname: string;

    @ApiProperty()
    public_ipv4: string;
}

export class Ec2RunningServerWithInstanceInfo extends Ec2InstanceInfo {
    @ApiProperty()
    domain_hostname: string

    @ApiProperty()
    server_running_port_number:number
}