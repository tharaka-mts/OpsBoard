module "vpc" {
  source               = "./modules/vpc"
  project_name         = var.project_name
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "security_groups" {
  source           = "./modules/security-groups"
  project_name     = var.project_name
  vpc_id           = module.vpc.vpc_id
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

module "jenkins_controller" {
  source            = "./modules/ec2-jenkins-controller"
  project_name      = var.project_name
  subnet_id         = module.vpc.public_subnet_ids[0]
  security_group_id = module.security_groups.jenkins_controller_sg_id
  instance_type     = var.jenkins_controller_instance_type
  key_pair_name     = var.key_pair_name
}

module "jenkins_agent" {
  source            = "./modules/ec2-jenkins-agent"
  project_name      = var.project_name
  subnet_id         = module.vpc.public_subnet_ids[1] # Distribute across AZs
  security_group_id = module.security_groups.jenkins_agent_sg_id
  instance_type     = var.jenkins_agent_instance_type
  key_pair_name     = var.key_pair_name
}

module "eks" {
  source                    = "./modules/eks"
  create_eks                = var.create_eks
  project_name              = var.project_name
  vpc_id                    = module.vpc.vpc_id
  subnet_ids                = module.vpc.private_subnet_ids
  cluster_security_group_id = module.security_groups.eks_cluster_sg_id
  node_security_group_id    = module.security_groups.eks_nodes_sg_id
  node_instance_type        = var.eks_node_instance_type
}
