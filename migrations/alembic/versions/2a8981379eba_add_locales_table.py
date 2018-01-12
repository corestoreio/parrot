"""add locales table

Revision ID: 2a8981379eba
Revises: 438b950c4c9a
Create Date: 2018-01-10 16:21:39.595957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2a8981379eba'
down_revision = '438b950c4c9a'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE locales (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            ident TEXT NOT NULL,
            language TEXT NOT NULL,
            country TEXT NOT NULL,
            pairs hstore,
            project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
            UNIQUE (ident, project_id)
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE locales;
    """)
