output "cluster_name" {
  description = "EKS Cluster Name"
  value       = var.create_eks ? aws_eks_cluster.this[0].name : null
}

output "cluster_endpoint" {
  description = "EKS Cluster Endpoint"
  value       = var.create_eks ? aws_eks_cluster.this[0].endpoint : null
}

output "cluster_certificate_authority_data" {
  description = "EKS Cluster Certificate Authority Data"
  value       = var.create_eks ? aws_eks_cluster.this[0].certificate_authority[0].data : null
}
