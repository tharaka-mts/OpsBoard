variable "aws_region" {
  type        = string
  description = "AWS Region to deploy to"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Name of the project"
  default     = "opsboard"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of public subnet CIDRs"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "List of private subnet CIDRs"
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR block allowed to SSH"
  default     = "0.0.0.0/0"
}

variable "jenkins_controller_instance_type" {
  type        = string
  description = "Instance type for Jenkins controller"
  default     = "t3.medium"
}

variable "jenkins_agent_instance_type" {
  type        = string
  description = "Instance type for Jenkins agent"
  default     = "t3.large"
}

variable "eks_node_instance_type" {
  type        = string
  description = "Instance type for EKS worker nodes"
  default     = "t3.medium"
}

variable "key_pair_name" {
  type        = string
  description = "Name of the existing EC2 Key Pair to use"
  default     = null
}

variable "create_eks" {
  type        = bool
  description = "Controls whether EKS cluster is created (Phase 1 vs Phase 2)"
  default     = false
}
