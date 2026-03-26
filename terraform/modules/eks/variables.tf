variable "create_eks" {
  type        = bool
  description = "Whether to create EKS resources"
  default     = false
}

variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for EKS nodes"
}

variable "cluster_security_group_id" {
  type        = string
  description = "Security Group ID for the EKS Cluster"
}

variable "node_security_group_id" {
  type        = string
  description = "Security Group ID for the EKS Nodes"
}

variable "node_instance_type" {
  type        = string
  description = "Instance type for EKS managed node group"
}
