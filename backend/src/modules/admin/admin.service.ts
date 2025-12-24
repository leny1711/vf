import prisma from '../../config/database';

export class AdminService {
  async getDashboard() {
    const totalUsers = await prisma.user.count();
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const totalProviders = await prisma.user.count({ where: { role: 'PROVIDER' } });
    const availableProviders = await prisma.user.count({
      where: { role: 'PROVIDER', isAvailable: true },
    });

    const totalMissions = await prisma.mission.count();
    const pendingMissions = await prisma.mission.count({ where: { status: 'PENDING' } });
    const activeMissions = await prisma.mission.count({
      where: { status: { in: ['ACCEPTED', 'IN_PROGRESS'] } },
    });
    const completedMissions = await prisma.mission.count({ where: { status: 'COMPLETED' } });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amount: true },
    });

    const platformRevenue = await prisma.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { platformFee: true },
    });

    return {
      users: {
        total: totalUsers,
        clients: totalClients,
        providers: totalProviders,
        availableProviders,
      },
      missions: {
        total: totalMissions,
        pending: pendingMissions,
        active: activeMissions,
        completed: completedMissions,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        platform: platformRevenue._sum.platformFee || 0,
      },
    };
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isAvailable: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAllMissions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const missions = await prisma.mission.findMany({
      skip,
      take: limit,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.mission.count();

    return {
      missions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAllPayments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const payments = await prisma.payment.findMany({
      skip,
      take: limit,
      include: {
        mission: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.payment.count();

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async blockUser(userId: string, isBlocked: boolean) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isBlocked: true,
      },
    });

    return user;
  }

  async deleteUser(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }
}
