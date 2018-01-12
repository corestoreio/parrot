"""add projects table

Revision ID: 438b950c4c9a
Revises: 0e40ea638be8
Create Date: 2018-01-10 16:21:34.598966

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '438b950c4c9a'
down_revision = '0e40ea638be8'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE projects (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            keys text[]
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE projects;
    """)
