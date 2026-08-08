import prisma from "../db/prisma.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Get key performance metrics for vendor/admin dashboard
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const now = new Date();
  
  // Scoping for vendor
  const isVendor = req.user?.role === "ADMIN";
  const vendorFilter = isVendor ? { vendorId: req.user.id } : {};
  const orderFilter = isVendor ? {
    lines: { some: { variant: { product: { vendorId: req.user.id } } } }
  } : {};

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
    prisma.rentalOrder.count({ where: orderFilter }),
    prisma.rentalOrder.count({ where: { status: "PICKED_UP", ...orderFilter } }),
    prisma.rentalOrder.count({ where: { status: "CONFIRMED", ...orderFilter } }),
    prisma.rentalOrder.count({ where: { status: "RETURNED", ...orderFilter } }),
    prisma.rentalOrder.count({
      where: {
        status: "PICKED_UP",
        rentalEnd: { lt: now },
        ...orderFilter
      },
    }),
    prisma.product.count({ where: vendorFilter }),
    prisma.rentalOrder.findMany({
      where: orderFilter,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        deposit: true,
      },
    }),
    prisma.deposit.aggregate({
      where: isVendor ? { order: orderFilter } : undefined,
      _sum: {
        amountCollected: true,
        totalDeduction: true,
        refundAmount: true,
      },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS", ...(isVendor ? { order: orderFilter } : {}) },
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

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { recipientId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      order: {
        select: { orderNumber: true }
      }
    }
  });

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.notification.update({
    where: { id, recipientId: req.user.id },
    data: { status: "SENT" } // using SENT as 'read' status
  });
  return res.status(200).json(new ApiResponse(200, null, "Marked as read"));
});

export { getDashboardMetrics, getNotifications, markNotificationRead };
