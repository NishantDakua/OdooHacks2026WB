import prisma from "../db/prisma.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Get key performance metrics for vendor/admin dashboard
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const now = new Date();

  const [
    totalOrdersCount,
    activeRentalsCount,
    pendingPickupsCount,
    returnedAwaitingInspection,
    overdueCount,
    totalProductsCount,
    recentOrders,
    depositStats,
    paymentStats,
  ] = await Promise.all([
    prisma.rentalOrder.count(),
    prisma.rentalOrder.count({ where: { status: "PICKED_UP" } }),
    prisma.rentalOrder.count({ where: { status: "CONFIRMED" } }),
    prisma.rentalOrder.count({ where: { status: "RETURNED" } }),
    prisma.rentalOrder.count({
      where: {
        status: "PICKED_UP",
        rentalEnd: { lt: now },
      },
    }),
    prisma.product.count(),
    prisma.rentalOrder.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        deposit: true,
      },
    }),
    prisma.deposit.aggregate({
      _sum: {
        amountCollected: true,
        totalDeduction: true,
        refundAmount: true,
      },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
  ]);

  const metrics = {
    totalOrders: totalOrdersCount,
    activeRentals: activeRentalsCount,
    pendingPickups: pendingPickupsCount,
    returnedAwaitingInspection,
    overdueRentals: overdueCount,
    totalProducts: totalProductsCount,
    totalRevenue: paymentStats._sum.amount || 0,
    depositsCollected: depositStats._sum.amountCollected || 0,
    depositsRefunded: depositStats._sum.refundAmount || 0,
    recentOrders,
  };

  return res.status(200).json(
    new ApiResponse(200, metrics, "Dashboard metrics fetched successfully")
  );
});

export { getDashboardMetrics };
