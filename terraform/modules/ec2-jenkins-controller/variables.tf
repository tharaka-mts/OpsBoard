variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where to place the instance"
}

variable "security_group_id" {
  type        = string
  description = "Security Group ID for the instance"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "key_pair_name" {
  type        = string
  description = "SSH key pair name"
  default     = null
}
