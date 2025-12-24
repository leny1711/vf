import prisma from '../../config/database';

export class UsersService {
  async updateLocation(userId: string, latitude: number, longitude: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { latitude, longitude },
      select: {
        id: true,
        latitude: true,
        longitude: true,
      },
    });

    return user;
  }

  async toggleAvailability(userId: string, isAvailable: boolean) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isAvailable },
      select: {
        id: true,
        isAvailable: true,
      },
    });

    return user;
  }

  async getProviderStats(userId: string) {
    const completedMissions = await prisma.mission.count({
      where: {
        providerId: userId,
        status: 'COMPLETED',
      },
    });

    const totalEarnings = await prisma.payment.aggregate({
      where: {
        mission: {
          providerId: userId,
          status: 'COMPLETED',
        },
        status: 'SUCCEEDED',
      },
      _sum: {
        providerAmount: true,
      },
    });

    const averageRating = await prisma.rating.aggregate({
      where: {
        providerId: userId,
      },
      _avg: {
        score: true,
      },
    });

    return {
      completedMissions,
      totalEarnings: totalEarnings._sum.providerAmount || 0,
      averageRating: averageRating._avg.score || 0,
    };
  }

  async getClientStats(userId: string) {
    const totalMissions = await prisma.mission.count({
      where: {
        clientId: userId,
      },
    });

    const completedMissions = await prisma.mission.count({
      where: {
        clientId: userId,
        status: 'COMPLETED',
      },
    });

    return {
      totalMissions,
      completedMissions,
    };
  }
}
