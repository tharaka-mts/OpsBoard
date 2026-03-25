import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Filter, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { workItemService } from "@/services/workItem.service";
import type { WorkItem, WorkItemStatus, WorkItemPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const workItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  environment: z.enum(["DEV", "STAGING", "PROD"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "BLOCKED", "DONE"]),
  ownerName: z.string().min(2, "Owner name is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type WorkItemFormValues = z.infer<typeof workItemSchema>;

export function DashboardPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<WorkItemFormValues>({
    resolver: zodResolver(workItemSchema),
    defaultValues: {
      status: "OPEN",
      priority: "MEDIUM",
      environment: "DEV",
    }
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await workItemService.getAll();
      setItems(data);
    } catch (e) {
      console.error("Failed to fetch items", e);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    reset({ status: "OPEN", priority: "MEDIUM", environment: "DEV", title: "", description: "", ownerName: "", dueDate: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description,
      priority: item.priority,
      environment: item.environment,
      status: item.status,
      ownerName: item.ownerName,
      dueDate: item.dueDate || ""
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: WorkItemFormValues) => {
    try {
      if (editingItem) {
        await workItemService.update(editingItem.id, data);
        toast.success("Work item updated successfully");
      } else {
        await workItemService.create(data);
        toast.success("Work item created successfully");
      }
      setIsModalOpen(false);
      reset();
      fetchItems();
    } catch (e) {
      console.error("Failed to save item", e);
      toast.error("Failed to save work item");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this Work Item?")) {
      try {
        await workItemService.delete(id);
        toast.success("Work item deleted successfully");
        fetchItems();
      } catch (e) {
        console.error("Failed to delete", e);
        toast.error("Failed to delete work item");
      }
    }
  };

  const getStatusColor = (status: WorkItemStatus) => {
    switch(status) {
      case "OPEN": return "secondary";
      case "IN_PROGRESS": return "default";
      case "BLOCKED": return "destructive";
      case "DONE": return "success";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: WorkItemPriority) => {
    switch(priority) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "default";
      case "MEDIUM": return "secondary";
      case "LOW": return "outline";
      default: return "default";
    }
  };

  const summary = {
    open: items.filter(i => i.status === "OPEN").length,
    inProgress: items.filter(i => i.status === "IN_PROGRESS").length,
    blocked: items.filter(i => i.status === "BLOCKED").length,
    done: items.filter(i => i.status === "DONE").length,
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl pt-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400 pb-1">Dashboard</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your team's operational backlog</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-purple-200 hover:bg-purple-50 text-purple-700 shadow-sm transition-all rounded-full px-5"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button onClick={openCreateModal} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-purple-500/20 text-white border-0 transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5 rounded-full px-5"><Plus className="mr-2 h-4 w-4" /> Create Work Item</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Open</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{summary.open}</div></CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">In Progress</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{summary.inProgress}</div></CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-rose-100 dark:border-rose-900/50 shadow-md hover:shadow-lg hover:shadow-rose-500/10 transition-all hover:-translate-y-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Blocked</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-extrabold text-rose-600 dark:text-rose-400">{summary.blocked}</div></CardContent>
        </Card>
        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/50 shadow-md hover:shadow-lg hover:shadow-emerald-500/10 transition-all hover:-translate-y-1">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Done</CardTitle></CardHeader>
          <CardContent><div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{summary.done}</div></CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-purple-100/50 dark:border-purple-900/50 shadow-xl shadow-purple-500/5 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-slate-800/50 transition-colors">
                <th className="h-14 px-5 text-left font-semibold text-purple-900 dark:text-purple-200">Actions</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">ID</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">Title</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">Status</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">Priority</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">Environment</th>
                <th className="h-14 px-6 text-left font-semibold text-purple-900 dark:text-purple-200">Owner</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="h-32 text-center text-slate-500 font-medium animate-pulse">Loading items...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} className="h-32 text-center text-slate-500 font-medium">No work items found. Add some by clicking the button above!</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/50 transition-colors hover:bg-purple-50/30 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEditModal(item)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors" title="Edit Item">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/50 transition-colors" title="Delete Item">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">WI-{item.id}</td>
                    <td className="px-6 py-4 min-w-[300px] font-medium text-slate-900 dark:text-slate-100">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(item.status)} className="shadow-sm">{item.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getPriorityColor(item.priority)} className="shadow-sm">{item.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:bg-purple-900/30 shadow-sm">{item.environment}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">{item.ownerName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-0 ring-1 ring-purple-500/20 bg-white/95 dark:bg-slate-900/95 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
                {editingItem ? 'Edit Work Item' : 'Create Work Item'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                  <input {...register("title")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm transition-all" placeholder="E.g. Update database credentials" />
                  {errors.title && <span className="text-xs font-medium text-rose-500">{errors.title.message}</span>}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <textarea {...register("description")} className="flex min-h-[90px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm transition-all" placeholder="Detailed description of the task..." />
                  {errors.description && <span className="text-xs font-medium text-rose-500">{errors.description.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Priority</label>
                    <select {...register("priority")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm cursor-pointer transition-all">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                    <select {...register("status")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm cursor-pointer transition-all">
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Environment</label>
                    <select {...register("environment")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm cursor-pointer transition-all">
                      <option value="DEV">Dev</option>
                      <option value="STAGING">Staging</option>
                      <option value="PROD">Prod</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Owner Name</label>
                    <input {...register("ownerName")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm transition-all" placeholder="E.g. Alice" />
                    {errors.ownerName && <span className="text-xs font-medium text-rose-500">{errors.ownerName.message}</span>}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Due Date</label>
                  <input type="date" {...register("dueDate")} className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 shadow-sm cursor-pointer transition-all" />
                  {errors.dueDate && <span className="text-xs font-medium text-rose-500">{errors.dueDate.message}</span>}
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4">
                  <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); reset(); }} className="rounded-full px-6 border-slate-200">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-full px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-purple-500/20 transition-all hover:-translate-y-0.5">{isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Create Item')}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
