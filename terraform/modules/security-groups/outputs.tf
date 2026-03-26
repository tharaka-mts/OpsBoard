output "jenkins_controller_sg_id" {
  description = "Security group ID for Jenkins Controller"
  value       = aws_security_group.jenkins_controller.id
}

output "jenkins_agent_sg_id" {
  description = "Security group ID for Jenkins Agent"
  value       = aws_security_group.jenkins_agent.id
}

output "eks_cluster_sg_id" {
  description = "Security group ID for EKS Cluster"
  value       = aws_security_group.eks_cluster.id
}

output "eks_nodes_sg_id" {
  description = "Security group ID for EKS Nodes"
  value       = aws_security_group.eks_nodes.id
}
