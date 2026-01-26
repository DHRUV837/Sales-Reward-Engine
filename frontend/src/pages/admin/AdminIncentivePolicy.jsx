import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

const AdminIncentivePolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        commissionRate: "",
        minDealAmount: "",
        maxDealAmount: "",
        bonusThreshold: "",
        bonusAmount: "",
        active: true
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/policy/admin?type=INCENTIVE");
            setPolicies(response.data);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/policy", {
                ...formData,
                type: 'INCENTIVE',
                active: formData.active
            });
            alert("✅ Incentive policy created successfully!");
            setShowCreateForm(false);
            resetForm();
            fetchPolicies();
        } catch (error) {
            console.error("Error creating policy:", error);
            alert("❌ Failed to create policy: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this incentive policy?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/policy/${id}`);
            alert("✅ Policy deleted successfully!");
            fetchPolicies();
        } catch (error) {
            console.error("Error deleting policy:", error);
            alert("❌ Failed to delete policy");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            commissionRate: "",
            minDealAmount: "",
            maxDealAmount: "",
            bonusThreshold: "",
            bonusAmount: "",
            active: true
        });
        setEditingPolicy(null);
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Incentive Policy Management"
                subtitle="Create and manage commission rates and reward structures for deals."
                actions={
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showCreateForm ? "Cancel" : "Create New Policy"}
                    </button>
                }
            />

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="card-modern p-8 mb-6">
                    <h3 className="text-xl font-bold text-text-primary mb-6">
                        {editingPolicy ? "Edit" : "Create New"} Incentive Policy
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Policy Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Policy Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Standard 5% Commission"
                                    className="input-field"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Describe the policy terms and conditions..."
                                    className="input-field"
                                />
                            </div>

                            {/* Commission Rate */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Commission Rate (%) *
                                </label>
                                <input
                                    type="number"
                                    name="commissionRate"
                                    value={formData.commissionRate}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="e.g., 5"
                                    className="input-field"
                                />
                            </div>

                            {/* Min Deal Amount */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Min Deal Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="minDealAmount"
                                    value={formData.minDealAmount}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g., 100000"
                                    className="input-field"
                                />
                            </div>

                            {/* Max Deal Amount */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Max Deal Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="maxDealAmount"
                                    value={formData.maxDealAmount}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g., 1000000"
                                    className="input-field"
                                />
                            </div>

                            {/* Bonus Threshold */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Bonus Threshold (₹)
                                </label>
                                <input
                                    type="number"
                                    name="bonusThreshold"
                                    value={formData.bonusThreshold}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g., 500000"
                                    className="input-field"
                                />
                                <p className="mt-1 text-xs text-text-muted">
                                    Deals above this amount get bonus
                                </p>
                            </div>

                            {/* Bonus Amount */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Bonus Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="bonusAmount"
                                    value={formData.bonusAmount}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g., 10000"
                                    className="input-field"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={formData.active}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-text-primary">
                                        Active (visible to sales executives)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="btn-primary flex-1">
                                {editingPolicy ? "Update" : "Create"} Policy
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Policies List */}
            <div className="card-modern overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-text-muted">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading policies...
                    </div>
                ) : policies.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Incentive Policies</h3>
                        <p className="text-text-muted mb-6">Create your first incentive policy to reward your sales team</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn-primary"
                        >
                            Create First Policy
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-2 border-b border-border-subtle">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Policy Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Commission</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Deal Range</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Bonus</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {policies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-surface-2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-text-primary">{policy.title}</div>
                                            {policy.description && (
                                                <div className="text-sm text-text-muted mt-1">{policy.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-primary-600 dark:text-primary-400">
                                            {policy.commissionRate}%
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary text-sm">
                                            {policy.minDealAmount && policy.maxDealAmount
                                                ? `₹${policy.minDealAmount?.toLocaleString()} - ₹${policy.maxDealAmount?.toLocaleString()}`
                                                : policy.minDealAmount
                                                    ? `₹${policy.minDealAmount?.toLocaleString()}+`
                                                    : "All deals"}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary text-sm">
                                            {policy.bonusAmount
                                                ? `₹${policy.bonusAmount?.toLocaleString()} (>₹${policy.bonusThreshold?.toLocaleString()})`
                                                : "None"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${policy.isActive
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                                                }`}>
                                                {policy.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(policy.id)}
                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminIncentivePolicy;
