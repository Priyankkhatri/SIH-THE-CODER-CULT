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
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
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
  '🌅 Sunrise Best',
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
  const [showAllReviews, setShowAllReviews] = useState(false);

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
    setShowAllReviews(false);
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

  const displayedReviews = useMemo(() => {
    if (showAllReviews) return filteredReviews;
    return filteredReviews.slice(0, 3);
  }, [filteredReviews, showAllReviews]);

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
      {/* Section Eyebrow & Header */}
      <View style={styles.headerBlock}>
        <View style={styles.eyebrowRow}>
          <MaterialIcons name="forum" size={13} color={Colors.primary} />
          <Text style={styles.eyebrowText}>COMMUNITY ARCHIVE · VISITOR VOICES</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.reloadBtn}
              onPress={() => loadReviews(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="refresh" size={16} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => setIsModalOpen(true)}
              activeOpacity={0.85}
            >
              <MaterialIcons name="rate-review" size={14} color="#0A0A0E" />
              <Text style={styles.writeReviewBtnText}>+ Write Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionSubtitle}>
          Authentic visit impressions, travel advice, and cultural reflections from verified explorers.
        </Text>
      </View>

      {/* Hero Rating Overview Card - Spacious & Grand */}
      <View style={styles.overviewCard}>
        {/* Left: Overall Score & Verified Seal */}
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
            <MaterialIcons name="verified" size={12} color={Colors.success} />
            <Text style={styles.verifiedCommunityText}>100% Genuine</Text>
          </View>
        </View>

        {/* Vertical Divider */}
        <View style={styles.overviewDivider} />

        {/* Right: Star Progress Bars with Breathing Room */}
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

      {/* Filter Chips - Airy and Touch-Friendly */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {[
          { key: 'all', label: `All Reviews (${reviews.length})` },
          { key: '5star', label: '⭐ 5 Stars' },
          { key: '4star', label: '⭐ 4 Stars' },
          { key: 'family', label: '👨‍👩‍👧 Family Visits' },
          { key: 'solo', label: '🎒 Solo Travelers' },
        ].map((chip) => {
          const isActive = selectedFilter === chip.key;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => {
                setSelectedFilter(chip.key);
                setShowAllReviews(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Reviews List - Spacious Full-Width Vertical Cards */}
      {filteredReviews.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="rate-review" size={38} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Reviews Found</Text>
          <Text style={styles.emptyText}>Be the first to share your experience for this monument.</Text>
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => setIsModalOpen(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyActionText}>+ Write the First Review</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {displayedReviews.map((rev) => {
            const isHelpful = helpfulVoted[rev.id];
            const avatarColor = getAvatarColor(rev.userName);

            return (
              <View key={rev.id} style={styles.reviewCard}>
                {/* Author Info & Rating Row */}
                <View style={styles.cardHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                    <Text style={styles.avatarInitials}>{getInitials(rev.userName)}</Text>
                  </View>

                  <View style={styles.authorMeta}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName} numberOfLines={1}>
                        {rev.userName}
                      </Text>
                      {rev.badge ? (
                        <View style={styles.verifiedBadge}>
                          <MaterialIcons name="verified-user" size={11} color={Colors.primary} />
                          <Text style={styles.verifiedBadgeText}>{rev.badge}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.subMetaRow}>
                      {rev.visitType ? (
                        <Text style={styles.visitTypeTag}>{rev.visitType} Trip</Text>
                      ) : null}
                      <Text style={styles.timeAgo}>• {formatTimeAgo(rev.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Rating Stars Pill */}
                  <View style={styles.ratingScorePill}>
                    <MaterialIcons name="star" size={13} color="#0A0A0E" />
                    <Text style={styles.ratingScoreText}>{rev.rating.toFixed(1)}</Text>
                  </View>
                </View>

                {/* Review Title */}
                {rev.title ? (
                  <Text style={styles.reviewTitle}>
                    {rev.title}
                  </Text>
                ) : null}

                {/* Review Comment Body */}
                <Text style={styles.reviewComment}>
                  "{rev.comment}"
                </Text>

                {/* Card Footer with Helpful and Verified Visit Seal */}
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

                  <View style={styles.verifiedVisitTag}>
                    <MaterialIcons name="check-circle" size={13} color={Colors.success} />
                    <Text style={styles.verifiedVisitTagText}>Verified Visitor</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Show All / Show Less Toggle Button */}
          {filteredReviews.length > 3 && (
            <TouchableOpacity
              style={styles.toggleAllBtn}
              onPress={() => setShowAllReviews(!showAllReviews)}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleAllBtnText}>
                {showAllReviews
                  ? 'Show Fewer Reviews ↑'
                  : `Explore All ${filteredReviews.length} Reviews ↓`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Share Your Experience</Text>
                <Text style={styles.modalMonumentName} numberOfLines={1}>
                  {placeName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {/* Interactive Star Picker */}
              <View style={styles.starPickerBox}>
                <Text style={styles.pickerLabel}>OVERALL RATING</Text>
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
                        size={38}
                        color={newRating >= star ? Colors.primary : Colors.textMuted}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.starCaption}>
                  {RATING_CAPTIONS[newRating] || 'Select Rating'}
                </Text>
              </View>

              {/* Travel Companion Selector */}
              <Text style={styles.fieldLabel}>Who did you travel with?</Text>
              <View style={styles.visitTypeOptions}>
                {['Family', 'Solo', 'Couple', 'Friends'].map((type) => {
                  const isSelected = newVisitType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
                      onPress={() => setNewVisitType(type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.typeOptionText, isSelected && styles.typeOptionTextSelected]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Quick Highlight Tags */}
              <Text style={styles.fieldLabel}>Experience Highlights (Tap to include)</Text>
              <View style={styles.quickTagsContainer}>
                {QUICK_TAGS.map((tag, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickTagChip}
                    onPress={() => handleTagPress(tag)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Visitor Name */}
              <Text style={styles.fieldLabel}>Your Display Name</Text>
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
                placeholder="e.g., Majestic Indo-Saracenic grandeur in the morning light"
                placeholderTextColor={Colors.textMuted}
              />

              {/* Review Comment */}
              <Text style={styles.fieldLabel}>Detailed Experience & Advice *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Share advice about photography angles, audio guides, or crowd timing..."
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
                  <ActivityIndicator size="small" color="#0A0A0E" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={18} color="#0A0A0E" />
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
    marginTop: 22,
    marginBottom: 36,
  },

  // Header Block
  headerBlock: {
    marginBottom: 18,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.2,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  reloadBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  writeReviewBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A0A0E',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Overview Card (Airy & Grand Scorecard)
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.2)',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  bigScore: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 46,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
    marginVertical: 4,
  },
  totalReviewsCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  verifiedCommunityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: 8,
  },
  verifiedCommunityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  overviewDivider: {
    width: 1,
    height: '75%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
  },
  barsContainer: {
    flex: 1,
    gap: 7,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
    fontWeight: '500',
    color: Colors.textMuted,
    width: 28,
    textAlign: 'right',
  },

  // Filter Chips
  filterScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    borderColor: 'rgba(212, 175, 124, 0.5)',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  emptyActionBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.35)',
  },
  emptyActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Reviews List & Cards
  reviewsList: {
    gap: 14,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0E',
  },
  authorMeta: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212, 175, 124, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  visitTypeTag: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ratingScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  ratingScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A0A0E',
  },
  reviewTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  reviewComment: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  helpfulBtnActive: {
    backgroundColor: 'rgba(212, 175, 124, 0.15)',
  },
  helpfulText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  helpfulTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  verifiedVisitTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedVisitTagText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Toggle All Reviews Button
  toggleAllBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 124, 0.25)',
    marginTop: 4,
  },
  toggleAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    maxHeight: '88%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 124, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 14,
  },
  modalTitle: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  modalMonumentName: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 3,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  modalScroll: {
    gap: 16,
    paddingBottom: 40,
  },
  starPickerBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
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
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: -6,
  },
  visitTypeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: 'rgba(212, 175, 124, 0.16)',
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
  quickTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: Colors.text,
  },
  textArea: {
    minHeight: 95,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A0A0E',
    letterSpacing: 0.2,
  },
});
