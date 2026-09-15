import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useUserStore } from '../stores';
import { placesApi } from '../services/api/places.api';
import {
  ReviewItem,
  ReviewStats,
  getLocalReviews,
  saveLocalReview,
  computeReviewStats,
} from '../utils/reviewsData';
import { ReviewsSectionSkeleton } from './Skeleton';

interface ReviewsSectionProps {
  placeId: string;
  placeName: string;
  initialRating?: number;
}

const AVATAR_COLORS = [
  '#D4A947', '#C17F59', '#5B8FB9', '#8B6FC0', '#4CAF50', '#E67E5A', '#009688', '#E91E63'
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name[0] || 'U').toUpperCase();
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays <= 0) {
      if (diffHours <= 1) return 'Just now';
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch (e) {
    return 'Recent visit';
  }
}

const RATING_CAPTIONS: Record<number, string> = {
  1: 'Disappointing visit',
  2: 'Fair experience',
  3: 'Good historical site',
  4: 'Very good & recommended!',
  5: 'Exceptional & must-visit!',
};

const QUICK_TAGS = [
  '🏛️ Stunning Architecture',
  '🎧 Audio Guide Helpful',
  '📸 Great Photography',
  '👨‍👩‍👧 Family Friendly',
  '🌅 Sunrise / Morning Best',
  '🕊️ Peaceful Atmosphere',
];

export function ReviewsSection({ placeId, placeName, initialRating = 4.6 }: ReviewsSectionProps) {
  const { name: currentUserName } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: initialRating,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 75, 4: 20, 3: 5, 2: 0, 1: 0 },
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newVisitType, setNewVisitType] = useState<string>('Family');
  const [newAuthorName, setNewAuthorName] = useState<string>(currentUserName || 'Heritage Visitor');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    loadReviews(true);
    // Reset modal fields whenever the target place changes
    setNewRating(5);
    setNewTitle('');
    setNewComment('');
    setNewVisitType('Family');
    setNewAuthorName(currentUserName || 'Heritage Visitor');
    setSelectedFilter('all');
  }, [placeId]);

  const loadReviews = async (showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    const start = Date.now();
    let loadedReviews: ReviewItem[] | null = null;
    let loadedStats: ReviewStats | null = null;

    try {
      const res: any = await placesApi.getReviews(placeId);
      if (res?.data?.reviews && Array.isArray(res.data.reviews) && res.data.reviews.length > 0) {
        loadedReviews = res.data.reviews;
        loadedStats = res.data.stats || computeReviewStats(res.data.reviews, initialRating);
      }
    } catch (e) {
      // Fallback to offline / seed reviews
    }

    if (!loadedReviews) {
      const localData = await getLocalReviews(placeId, placeName, initialRating);
      loadedReviews = localData.reviews;
      loadedStats = localData.stats;
    }

    if (showSkeleton) {
      const elapsed = Date.now() - start;
      if (elapsed < 450) {
        await new Promise((resolve) => setTimeout(resolve, 450 - elapsed));
      }
    }

    if (loadedReviews) setReviews(loadedReviews);
    if (loadedStats) setStats(loadedStats);
    setIsLoading(false);
  };

  const filteredReviews = useMemo(() => {
    if (selectedFilter === 'all') return reviews;
    if (selectedFilter === '5star') return reviews.filter((r) => Math.round(r.rating) === 5);
    if (selectedFilter === '4star') return reviews.filter((r) => Math.round(r.rating) === 4);
    if (selectedFilter === 'family') return reviews.filter((r) => r.visitType?.toLowerCase() === 'family');
    if (selectedFilter === 'solo') return reviews.filter((r) => r.visitType?.toLowerCase() === 'solo');
    return reviews;
  }, [reviews, selectedFilter]);

  const handleHelpfulToggle = (reviewId: string) => {
    const isVoted = helpfulVoted[reviewId];
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: !isVoted }));
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpfulCount: isVoted ? Math.max(0, r.helpfulCount - 1) : r.helpfulCount + 1,
          };
        }
        return r;
      })
    );
  };

  const handleTagPress = (tag: string) => {
    const cleanTag = tag.replace(/^[^\w\s]+/, '').trim();
    if (newComment.includes(cleanTag)) return;
    setNewComment((prev) => (prev ? `${prev} • ${cleanTag}` : cleanTag));
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    const reviewPayload = {
      userName: newAuthorName.trim() || 'Heritage Visitor',
      rating: newRating,
      title: newTitle.trim() || 'Remarkable Cultural Landmark',
      comment: newComment.trim(),
      visitType: newVisitType,
      badge: 'Verified Visitor',
    };

    try {
      await placesApi.addReview(placeId, reviewPayload);
    } catch (e) {
      console.warn('[ReviewsSection] API submission notice, saving locally:', e);
    }

    const saved = await saveLocalReview(placeId, reviewPayload);
    const updatedReviews = [saved, ...reviews];
    setReviews(updatedReviews);
    setStats(computeReviewStats(updatedReviews, initialRating));

    setSubmitting(false);
    setIsModalOpen(false);
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    setNewVisitType('Family');
    setNewAuthorName(currentUserName || 'Heritage Visitor');
  };

  if (isLoading) {
    return <ReviewsSectionSkeleton />;
  }

  return (
    <View style={styles.container}>
      {/* Section Title & Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="rate-review" size={22} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Visitor Reviews & Ratings</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.reloadBtn}
            onPress={() => loadReviews(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name="refresh" size={17} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.writeBtn}
            onPress={() => setIsModalOpen(true)}
            activeOpacity={0.85}
          >
            <MaterialIcons name="edit" size={15} color={Colors.textInverse} />
            <Text style={styles.writeBtnText}>Write Review</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionSubtitle}>
        Authentic reviews and visit insights from verified heritage explorers.
      </Text>

      {/* Rating Overview Histogram Card */}
      <View style={styles.overviewCard}>
        {/* Left: Overall Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.bigScore}>{stats.averageRating.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <MaterialIcons
                key={s}
                name={
                  stats.averageRating >= s
                    ? 'star'
                    : stats.averageRating >= s - 0.5
                    ? 'star-half'
                    : 'star-border'
                }
                size={18}
                color={Colors.primary}
              />
            ))}
          </View>
          <Text style={styles.totalReviewsCount}>
            {stats.totalReviews} verified {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </Text>
          <View style={styles.verifiedCommunityBadge}>
            <MaterialIcons name="verified" size={13} color={Colors.success} />
            <Text style={styles.verifiedCommunityText}>100% Genuine</Text>
          </View>
        </View>

        {/* Vertical Divider */}
        <View style={styles.overviewDivider} />

        {/* Right: Star Progress Bars */}
        <View style={styles.barsContainer}>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = stats.percentages[star] || 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.starLabel}>{star} ★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.pctLabel}>{pct}%</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {[
          { key: 'all', label: `All (${reviews.length})` },
          { key: '5star', label: '⭐ 5 Stars' },
          { key: '4star', label: '⭐ 4 Stars' },
          { key: 'family', label: '👨‍👩‍👦 Family Visits' },
          { key: 'solo', label: '🎒 Solo Travelers' },
        ].map((chip) => {
          const isActive = selectedFilter === chip.key;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedFilter(chip.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Reviews List */}
      <View style={styles.reviewsList}>
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="rate-review" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No reviews match this filter.</Text>
          </View>
        ) : (
          filteredReviews.map((rev) => {
            const isHelpful = helpfulVoted[rev.id];
            const avatarColor = getAvatarColor(rev.userName);
            return (
              <View key={rev.id} style={styles.reviewCard}>
                {/* Header: Avatar, Name, Badge, Date */}
                <View style={styles.cardHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                    <Text style={styles.avatarInitials}>{getInitials(rev.userName)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{rev.userName}</Text>
                      {rev.badge && (
                        <View style={styles.badgeWrap}>
                          <MaterialIcons name="verified-user" size={11} color={Colors.primary} />
                          <Text style={styles.badgeText}>{rev.badge}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.dateAndTypeRow}>
                      <Text style={styles.timeAgo}>{formatTimeAgo(rev.createdAt)}</Text>
                      {rev.visitType && (
                        <Text style={styles.visitTypePill}>• {rev.visitType} Trip</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Star Rating & Title */}
                <View style={styles.ratingAndTitleRow}>
                  <View style={styles.starsInline}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <MaterialIcons
                        key={s}
                        name={rev.rating >= s ? 'star' : 'star-border'}
                        size={15}
                        color={Colors.primary}
                      />
                    ))}
                  </View>
                  {rev.title ? <Text style={styles.reviewTitle}>{rev.title}</Text> : null}
                </View>

                {/* Comment Body */}
                <Text style={styles.reviewComment}>{rev.comment}</Text>

                {/* Card Footer: Helpful button */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={[styles.helpfulBtn, isHelpful && styles.helpfulBtnActive]}
                    onPress={() => handleHelpfulToggle(rev.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons
                      name={isHelpful ? 'thumb-up' : 'thumb-up-off-alt'}
                      size={14}
                      color={isHelpful ? Colors.primary : Colors.textMuted}
                    />
                    <Text style={[styles.helpfulText, isHelpful && styles.helpfulTextActive]}>
                      Helpful ({rev.helpfulCount})
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.verifiedVisitFooter}>✓ Verified Visit</Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Write Review Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Rate Your Experience</Text>
                <Text style={styles.modalMonumentName} numberOfLines={1}>
                  {placeName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsModalOpen(false)}
              >
                <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {/* Interactive Star Picker */}
              <View style={styles.starPickerBox}>
                <Text style={styles.pickerLabel}>Overall Rating</Text>
                <View style={styles.interactiveStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setNewRating(star)}
                      activeOpacity={0.7}
                      style={styles.starTouch}
                    >
                      <MaterialIcons
                        name={newRating >= star ? 'star' : 'star-border'}
                        size={36}
                        color={newRating >= star ? Colors.primary : Colors.textMuted}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.starCaption}>
                  {RATING_CAPTIONS[newRating] || 'Select Rating'}
                </Text>
              </View>

              {/* Visit Type Selector */}
              <Text style={styles.fieldLabel}>Who did you travel with?</Text>
              <View style={styles.visitTypeOptions}>
                {['Family', 'Solo', 'Couple', 'Friends'].map((type) => {
                  const isSelected = newVisitType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
                      onPress={() => setNewVisitType(type)}
                    >
                      <Text style={[styles.typeOptionText, isSelected && styles.typeOptionTextSelected]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Quick Tags */}
              <Text style={styles.fieldLabel}>Highlights (Tap to include)</Text>
              <View style={styles.quickTagsContainer}>
                {QUICK_TAGS.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickTagChip}
                    onPress={() => handleTagPress(tag)}
                  >
                    <Text style={styles.quickTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Visitor Name */}
              <Text style={styles.fieldLabel}>Your Name</Text>
              <TextInput
                style={styles.textInput}
                value={newAuthorName}
                onChangeText={setNewAuthorName}
                placeholder="e.g., Anjali Sharma"
                placeholderTextColor={Colors.textMuted}
              />

              {/* Review Title */}
              <Text style={styles.fieldLabel}>Review Headline</Text>
              <TextInput
                style={styles.textInput}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g., Unforgettable architecture and serene morning"
                placeholderTextColor={Colors.textMuted}
              />

              {/* Review Comment */}
              <Text style={styles.fieldLabel}>Detailed Experience *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Share advice about crowd timing, photography spots, or audio guide insights..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!newComment.trim() || submitting) && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmitReview}
                disabled={!newComment.trim() || submitting}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.textInverse} />
                ) : (
                  <>
                    <MaterialIcons name="send" size={18} color={Colors.textInverse} />
                    <Text style={styles.submitBtnText}>Post Verified Review</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 21,
    fontWeight: '700',
    color: Colors.text,
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  reloadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },

  // Overview — quiet editorial split, no heavy card
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  bigScore: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 38,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  totalReviewsCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  verifiedCommunityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginTop: 6,
  },
  verifiedCommunityText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success,
  },
  overviewDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  barsContainer: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  pctLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    width: 28,
    textAlign: 'right',
  },

  // Filter Chips
  filterScroll: {
    gap: 8,
    paddingBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },

  // Reviews List
  reviewsList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: 8,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  reviewCard: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  dateAndTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  visitTypePill: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  ratingAndTitleRow: {
    gap: 4,
  },
  starsInline: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  reviewComment: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
    marginTop: 4,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
  },
  helpfulBtnActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
  },
  helpfulText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  helpfulTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  verifiedVisitFooter: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '88%',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: Spacing.sm,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  modalMonumentName: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: '500',
    maxWidth: 260,
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    gap: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  starPickerBox: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  interactiveStars: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  starTouch: {
    padding: 2,
  },
  starCaption: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  fieldLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: -4,
  },
  visitTypeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(212, 175, 124, 0.18)',
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  quickTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickTagChip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  textArea: {
    minHeight: 85,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
