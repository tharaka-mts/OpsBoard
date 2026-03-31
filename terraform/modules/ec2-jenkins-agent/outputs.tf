output "instance_id" {
  description = "The ID of the instance"
  value       = aws_instance.this.id
}

output "public_ip" {
  description = "Public IP of the instance"
  value       = aws_instance.this.public_ip
}

output "private_ip" {
  description = "Private IP of the instance"
  value       = aws_instance.this.private_ip
}

output "iam_role_name" {
  description = "IAM role name of the agent"
  value       = aws_iam_role.jenkins_agent.name
}

output "iam_role_arn" {
  description = "IAM role ARN of the agent"
  value       = aws_iam_role.jenkins_agent.arn
}
