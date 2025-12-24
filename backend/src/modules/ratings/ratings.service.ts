import prisma from '../../config/database';

export interface CreateRatingDto {
  missionId: string;
  score: number;
  comment?: string;
}

export class RatingsService {
  async createRating(userId: string, data: CreateRatingDto) {
    const mission = await prisma.mission.findUnique({
      where: { id: data.missionId },
    });

    if (!mission) {
      throw new Error('Mission not found');
    }

    if (mission.status !== 'COMPLETED') {
      throw new Error('Can only rate completed missions');
    }

    if (mission.clientId !== userId) {
      throw new Error('Only client can rate the mission');
    }

    if (!mission.providerId) {
      throw new Error('Mission has no provider');
    }

    const existingRating = await prisma.rating.findUnique({
      where: { missionId: data.missionId },
    });

    if (existingRating) {
      throw new Error('Mission already rated');
    }

    if (data.score < 1 || data.score > 5) {
      throw new Error('Score must be between 1 and 5');
    }

    const rating = await prisma.rating.create({
      data: {
        missionId: data.missionId,
        clientId: userId,
        providerId: mission.providerId,
        score: data.score,
        comment: data.comment,
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return rating;
  }

  async getProviderRatings(providerId: string) {
    const ratings = await prisma.rating.findMany({
      where: { providerId },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageScore = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
      : 0;

    return {
      ratings,
      averageScore: Math.round(averageScore * 10) / 10,
      totalRatings: ratings.length,
    };
  }

  async getRatingByMission(missionId: string) {
    const rating = await prisma.rating.findUnique({
      where: { missionId },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return rating;
  }
}
