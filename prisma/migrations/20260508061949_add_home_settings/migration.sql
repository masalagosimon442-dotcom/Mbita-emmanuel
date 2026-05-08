-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `heroCTALink` VARCHAR(191) NULL,
    ADD COLUMN `heroCTAText` VARCHAR(191) NULL,
    ADD COLUMN `heroSubtitle` VARCHAR(191) NULL,
    ADD COLUMN `heroTitle` VARCHAR(191) NULL,
    ADD COLUMN `showAchievements` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showAnnouncements` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showNewsSlider` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showPublications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showQuickLinks` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showResearchHighlights` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showStats` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showTestimonials` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `showUpcomingEvents` BOOLEAN NOT NULL DEFAULT true;
