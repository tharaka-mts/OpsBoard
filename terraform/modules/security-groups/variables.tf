variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "vpc_id" {
  type        = string
  description = "The VPC ID where security groups will be created"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH"
}
