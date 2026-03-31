resource "aws_iam_role" "eks_cluster" {
  count = var.create_eks ? 1 : 0
  name  = "${var.project_name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  count      = var.create_eks ? 1 : 0
  role       = aws_iam_role.eks_cluster[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  count      = var.create_eks ? 1 : 0
  role       = aws_iam_role.eks_cluster[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
}

resource "aws_eks_cluster" "this" {
  count    = var.create_eks ? 1 : 0
  name     = "${var.project_name}-cluster"
  role_arn = aws_iam_role.eks_cluster[0].arn

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [var.cluster_security_group_id]
  }

  access_config {
    authentication_mode = "API_AND_CONFIG_MAP"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller
  ]
}

resource "aws_eks_access_entry" "jenkins_agent" {
  count         = var.create_eks ? 1 : 0
  cluster_name  = aws_eks_cluster.this[0].name
  principal_arn = var.jenkins_agent_role_arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "jenkins_agent_admin" {
  count         = var.create_eks ? 1 : 0
  cluster_name  = aws_eks_cluster.this[0].name
  policy_arn    = "arn:aws:iam::aws:policy/AmazonEKSClusterAdminPolicy"
  principal_arn = var.jenkins_agent_role_arn

  access_scope {
    type = "cluster"
  }
}

resource "aws_iam_role" "eks_nodes" {
  count = var.create_eks ? 1 : 0
  name  = "${var.project_name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  count      = var.create_eks ? 1 : 0
  role       = aws_iam_role.eks_nodes[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  count      = var.create_eks ? 1 : 0
  role       = aws_iam_role.eks_nodes[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eks_container_registry_read_only" {
  count      = var.create_eks ? 1 : 0
  role       = aws_iam_role.eks_nodes[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_eks_node_group" "this" {
  count           = var.create_eks ? 1 : 0
  cluster_name    = aws_eks_cluster.this[0].name
  node_group_name = "${var.project_name}-node-group"
  node_role_arn   = aws_iam_role.eks_nodes[0].arn
  subnet_ids      = var.subnet_ids
  instance_types  = [var.node_instance_type]

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_read_only,
  ]
}
